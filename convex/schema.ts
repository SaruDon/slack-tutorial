import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { auth } from "./auth";
import { v } from "convex/values"

const schema = defineSchema({
  ...authTables,
  // In Convex, a schema is defined to structure the data stored in workspaces.
  // Here's how you can define and create a table named 'workspaces'.
  // The table will include three fields: name (a string), userId (a reference to another table called 'users'), and joinCode (a string).
  workspaces: defineTable({
    name: v.string(),
    userId: v.id("users"),
    joinCode: v.string()
  }),
  members: defineTable({
    userId: v.id("users"), // Corrected to use v.id() without arguments
    workspaceId: v.id("workspaces"), // Corrected to use v.id() without arguments
    role: v.union(v.literal("admin"), v.literal("member")) // Corrected type definition for role
  })
    .index("by_user_id", ["userId"])
    .index("by_workspace_id", ["workspaceId"])
    .index("by_workspace_id_user_id", ["workspaceId", "userId"]),
  channels: defineTable({
    name: v.string(),
    workspaceId: v.id("workspaces"),
  })
    .index("by_workspace_id", ["workspaceId"]),
  conversations: defineTable({
    workspaceId: v.id("workspaces"),
    memberOne: v.id("members"),
    memberTwo: v.id("members"),
  })
    .index("by_workspace_id", ["workspaceId"]),
  messages: defineTable({
    body: v.string(),
    image: v.optional(v.id("_storage")),
    memberId: v.id("members"),
    workspaceId: v.id("workspaces"),
    channelId: v.optional(v.id("channels")),
    parentMessageId: v.optional(v.id("messages")),
    conversationId: v.optional(v.id("conversations")),
    updatedAt: v.optional(v.number())
  })
    .index("by_workspace_id", ["workspaceId"])
    .index("by_member_id", ["memberId"])
    .index("by_channel_id", ["channelId"])
    .index("by_parentmessage_id", ["parentMessageId"])
    .index("by_conversation_id", ["conversationId"])
    .index("by_channel_id_parent_message_id_conversation_id", ["channelId", "parentMessageId", "conversationId"]),
  reactions: defineTable({
    workspaceId: v.id("workspaces"),
    messageId: v.id("messages"),
    memberId: v.id("members"),
    value: v.string(),
  })
    .index("by_message_id", ["messageId"])
    .index("by_workspace_id", ["workspaceId"])
    .index("by_member_id", ["memberId"])
})

export default schema