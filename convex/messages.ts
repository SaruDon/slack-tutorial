import { v } from "convex/values";
import { mutation, QueryCtx } from "./_generated/server";
import { auth } from "./auth";
import { Id } from "./_generated/dataModel";


const getMember = async (userId: Id<"users">,
  ctx: QueryCtx,
  workSpaceId: Id<"workspaces">) => {
  return await ctx.db
    .query("members")
    .withIndex("by_workspace_id_user_id", (q) => q.eq("workspaceId", workSpaceId).eq("userId", userId))
    .unique()
}


export const create = mutation({
  args: {
    body: v.string(),
    image: v.optional(v.id("_storage")),
    workspaceId: v.id("workspaces"),
    channelId: v.optional(v.id("channels")),
    messageId: v.optional(v.id("messages")),
    //Todo conversation Id
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx)
    if (!userId) {
      throw new Error("Unauthorized")
    }

    const member = await getMember(userId, ctx, args.workspaceId);


    if (!member) {
      throw new Error("Unauthoized")
    }

    console.log('agrs.imgage', args.image)

    //Todo Handle conversationId

    const messageId = await ctx.db.insert("messages", {
      memberId: member._id,
      image: args.image,
      channeId: args.channelId,
      parentMessageId: args.messageId,
      workspaceId: args.workspaceId,
      body: args.body,
      updatedAt: Date.now()
      //Todo handle conversation Id
    })

    return messageId
  }
})