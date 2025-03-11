import { v } from "convex/values"
import { Id } from "./_generated/dataModel"
import { mutation, QueryCtx } from "./_generated/server"
import { auth } from "./auth"

const getMember = async (userId: Id<"users">,
  ctx: QueryCtx,
  workSpaceId: Id<"workspaces">) => {
  return await ctx.db
    .query("members")
    .withIndex("by_workspace_id_user_id", (q) => q.eq("workspaceId", workSpaceId).eq("userId", userId))
    .unique()
}


export const toggle = mutation({
  args: { messageId: v.id("messages"), value: v.string() },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized")
    }

    const message = await ctx.db.get(args.messageId);
    if (!message) {
      throw new Error("Messages does'nt exist")
    }

    const member = await getMember(userId, ctx, message.workspaceId);
    if (!member) {
      throw new Error("Unauthorized")
    }

    const existingMessageReactionFromUser = await ctx.db
      .query("reactions")
      .filter((q) =>
        q.and(
          q.eq(q.field("messageId"), args.messageId),
          q.eq(q.field("memberId"), member._id),
          q.eq(q.field("value"), args.value),
        )
      )
      .first()



    if (existingMessageReactionFromUser) {
      await ctx.db.delete(existingMessageReactionFromUser._id)
      return existingMessageReactionFromUser._id
    } else {


      const newReactionId = await ctx.db.insert("reactions",
        {
          messageId: args.messageId,
          value: args.value,
          workspaceId: message.workspaceId,
          memberId: member._id
        }
      )
      return newReactionId;
    }
  }
})