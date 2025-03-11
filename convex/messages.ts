import { current } from './members';
import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { auth } from "./auth";
import { Doc, Id } from "./_generated/dataModel";
import { paginationOptsValidator } from "convex/server";


const populateThread = async (ctx: QueryCtx, messageId: Id<"messages">) => {
  const messages = await ctx.db
    .query("messages")
    .withIndex("by_parentmessage_id", (q) => q.eq("parentMessageId", messageId))
    .collect()

  if (messages.length === 0) {
    return {
      count: 0,
      image: undefined,
      timestamp: 0,
      name: ""
    }
  }
  const lastMessage = messages[messages.length - 1]
  const lastMessageMember = await populateMember(ctx, lastMessage.memberId)
  if (!lastMessageMember) {
    return {
      count: messages.length,
      image: undefined,
      timestamp: 0,
      name: ""
    }
  }

  const lastMessageUser = await populateUser(ctx, lastMessageMember.userId);
  return {
    count: messages.length,
    image: lastMessageUser?.image,
    time: lastMessage?._creationTime,
    name: lastMessageUser?.name
  }
}

const populateReactions = async (ctx: QueryCtx, messageId: Id<"messages">) => {
  return await ctx.db
    .query("reactions")
    .withIndex("by_message_id", (q) => q.eq("messageId", messageId))
    .collect()
}


const populateUser = async (ctx: QueryCtx, userId: Id<"users">) => {
  return await ctx.db.get(userId)
}

const populateMember = async (ctx: QueryCtx, memberId: Id<"members">) => {
  return await ctx.db.get(memberId)
}


const getMember = async (userId: Id<"users">,
  ctx: QueryCtx,
  workSpaceId: Id<"workspaces">) => {
  return await ctx.db
    .query("members")
    .withIndex("by_workspace_id_user_id", (q) => q.eq("workspaceId", workSpaceId).eq("userId", userId))
    .unique()
}

export const get = query({
  args: {
    // Optional arguments for filtering messages
    channelId: v.optional(v.id("channels")),
    conversationId: v.optional(v.id("conversations")),
    parentMessageId: v.optional(v.id("messages")),
    paginationOpts: paginationOptsValidator
  },
  handler: async (ctx, args) => {
    // Get the user ID from the context
    const userId = await auth.getUserId(ctx)
    if (!userId) {
      // Throw an error if the user is not authorized
      throw new Error("Unauthorized")
    }

    let _conversationId = args.conversationId;
    // Handle the case where the message is a reply in a 1:1 conversation
    if (!args.channelId && !args.conversationId && args.parentMessageId) {

      const parentMessage = await ctx.db.get(args.parentMessageId)
      if (!parentMessage) {
        // Throw an error if the parent message is not found
        throw new Error("Parent message not found")
      }

      // Set the conversation ID to the parent message's conversation ID
      _conversationId = parentMessage.conversationId
    }

    // Query the messages based on the provided arguments
    const results = await ctx.db
      .query("messages")
      .withIndex("by_channel_id_parent_message_id_conversation_id", (q) =>
        q
          .eq("channelId", args.channelId)
          .eq("parentMessageId", args.parentMessageId) //filter messages with parentId
          .eq("conversationId", _conversationId))
      .order("desc")
      .paginate(args.paginationOpts)

    return {
      ...results,
      page: (
        await Promise.all(
          results.page.map(async (message) => {
            // Populate member and user details
            const member = await populateMember(ctx, message.memberId)
            const user = member ? await populateUser(ctx, member.userId) : null
            if (!member || !user) {
              return
            }

            // Populate reactions, thread, and image details
            const reactions = await populateReactions(ctx, message._id)
            const thread = await populateThread(ctx, message._id)
            const image = message.image ? await ctx.storage.getUrl(message.image) : undefined

            // Calculate reaction counts and deduplicate reactions
            const reactionsWIthCounts = reactions.map((reaction) => {
              return {
                ...reaction,
                count: reactions.filter((r) => r.value === reaction.value).length
              }
            })

            // Reduce the reactionsWithCounts array to a new array with deduplicated reactions
            const dedupedReaction = reactionsWIthCounts.reduce(
              (acc, reaction) => {
                // Find an existing reaction in the accumulator array that matches the current reaction's value
                const exitingReaction = acc.find(
                  (r) => r.value === reaction.value
                )

                if (exitingReaction) {
                  // If an existing reaction is found, update its memberIds array
                  // by merging it with the current reaction's memberId
                  exitingReaction.memberIds = Array.from(
                    new Set([...exitingReaction.memberIds, reaction.memberId])
                  )
                } else {
                  // If no existing reaction is found, add the current reaction to the accumulator array
                  // with its memberIds array initialized to contain the current reaction's memberId
                  acc.push({ ...reaction, memberIds: [reaction.memberId] })
                }

                // Return the updated accumulator array
                return acc;
              },
              // Initialize the accumulator array as an empty array of the specified type
              [] as (Doc<"reactions"> & {
                count: number,
                memberIds: Id<"members">[]
              })[]
            );

            const reactionsWithoutMemberIdProperty = dedupedReaction.map(({ memberId, ...rest }) => rest)

            // Return the message with populated details
            return {
              ...message,
              image,
              member,
              user,
              reactions: reactionsWithoutMemberIdProperty,
              threadCount: thread.count,
              threadImage: thread.image,
              threadTimestamp: thread.time,
              threadName: thread.name
            }
          })
        )
      ).filter(
        (message): message is NonNullable<typeof message> => message !== null
      )
    }
  }
})

export const create = mutation({
  args: {
    body: v.string(), // The main content of the message
    image: v.optional(v.id("_storage")), // Optional image ID associated with the message
    workspaceId: v.id("workspaces"), // ID of the workspace where the message is being sent
    channelId: v.optional(v.id("channels")), // Optional ID of the channel where the message is being sent
    conversationId: v.optional(v.id("conversations")), // Optional ID of the conversation where the message is being sent
    messageId: v.optional(v.id("messages")), // Optional ID of the message being replied to
    parentMessageId: v.optional(v.id("messages")) // Optional ID of the parent message in a thread
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx) // Get the user ID from the context
    if (!userId) {
      throw new Error("Unauthorized") // Throw an error if the user is not authorized
    }

    const member = await getMember(userId, ctx, args.workspaceId); // Get the member details

    if (!member) {
      throw new Error("Unauthorized") // Throw an error if the member is not found
    }

    let _conversationId = args.conversationId; // Initialize the conversation ID

    // If no conversation ID and channel ID are provided but a parent message ID is, it means the message is a reply in a thread
    if (!args.conversationId && !args.channelId && args.parentMessageId) {
      const parentMessage = await ctx.db.get(args.parentMessageId); // Get the parent message details
      if (!parentMessage) {
        throw new Error("Parent message not found") // Throw an error if the parent message is not found
      }
      _conversationId = parentMessage.conversationId // Set the conversation ID to the parent message's conversation ID
    }

    // Insert the new message into the database
    const messageId = await ctx.db.insert("messages", {
      memberId: member._id, // ID of the member sending the message
      image: args.image, // Image ID if present
      channelId: args.channelId, // Channel ID if present
      conversationId: _conversationId, // Conversation ID
      parentMessageId: args.parentMessageId, // Parent message ID if present
      workspaceId: args.workspaceId, // Workspace ID
      body: args.body, // Main content of the message
    })
    // const createdMessage = await ctx.db.get(messageId);

    // // Log the created message
    // console.log("Created Message:", createdMessage);
    return messageId // Return the ID of the newly created message
  }
})


export const update = mutation({
  args: {
    id: v.id("messages"),
    body: v.string()
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx)
    if (!userId) {
      throw new Error("Unauthorized")
    }

    const message = await ctx.db.get(args.id)

    if (!message) {
      throw new Error("Message not found")
    }

    const member = await getMember(userId, ctx, message.workspaceId)
    if (!member || member._id !== message.memberId) {
      throw new Error("Unauthorized")
    }

    await ctx.db.patch(
      args.id, {
      body: args.body,
      updatedAt: Date.now()
    })

    return args.id

  }
})

export const remove = mutation({
  args: {
    id: v.id("messages"),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx)
    if (!userId) {
      throw new Error("Unauthorized")
    }

    const message = await ctx.db.get(args.id)

    if (!message) {
      throw new Error("Message not found")
    }

    const member = await getMember(userId, ctx, message.workspaceId)
    if (!member || member._id !== message.memberId) {
      throw new Error("Unauthorized")
    }

    await ctx.db.delete(args.id)

    return args.id;
  }
})

export const getMessageById = query({
  args: { messageId: v.id("messages") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx)
    if (!userId) {
      return null;
    }

    const message = await ctx.db.get(args.messageId);
    if (!message) {
      return null
    }

    const member = await populateMember(ctx, message.memberId);
    if (!member) {
      return null;
    }

    const currentMember = await getMember(userId, ctx, message.workspaceId)

    if (!currentMember) {
      return null
    }

    const user = await populateUser(ctx, member.userId);
    if (!user) {
      return null
    }
    const reactions = await populateReactions(ctx, message._id);

    const reactionsWIthCounts = reactions.map((reaction) => {
      return {
        ...reaction,
        count: reactions.filter((r) => r.value === reaction.value).length
      }
    })

    // Reduce the reactionsWithCounts array to a new array with deduplicated reactions
    const dedupedReaction = reactionsWIthCounts.reduce(
      (acc, reaction) => {
        // Find an existing reaction in the accumulator array that matches the current reaction's value
        const exitingReaction = acc.find(
          (r) => r.value === reaction.value
        )

        if (exitingReaction) {
          // If an existing reaction is found, update its memberIds array
          // by merging it with the current reaction's memberId
          exitingReaction.memberIds = Array.from(
            new Set([...exitingReaction.memberIds, reaction.memberId])
          )
        } else {
          // If no existing reaction is found, add the current reaction to the accumulator array
          // with its memberIds array initialized to contain the current reaction's memberId
          acc.push({ ...reaction, memberIds: [reaction.memberId] })
        }

        // Return the updated accumulator array
        return acc;
      },
      // Initialize the accumulator array as an empty array of the specified type
      [] as (Doc<"reactions"> & {
        count: number,
        memberIds: Id<"members">[]
      })[]
    );


    const reactionsWithoutMemberIdProperty = dedupedReaction.map(({ memberId, ...rest }) => rest)

    return {
      ...message,
      image: message.image
        ? await ctx.storage.getUrl(message.image)
        : undefined,
      user,
      member,
      reactions: reactionsWithoutMemberIdProperty
    };
  }
})

