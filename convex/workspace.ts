// Import the query function from the generated server module
import { mutation, query } from "./_generated/server";
import { v } from "convex/values"
import { auth } from "./auth";

export const create = mutation({
  args: {
    name: v.string()
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx)
    if (!userId) {
      throw new Error("user not Loggedin")
    }

    const joinCode = "123456"

    const workSpaceId = await ctx.db.insert("workspaces", {
      name: args.name,
      userId,
      joinCode
    })

    const workSpace = await ctx.db.get(workSpaceId)
    console.log('workSpace', workSpace)

    return workSpaceId
  }
})

// Define a query named 'get' which will be used to fetch data from the database
export const get = query({
  // Specify the arguments required for this query, but in this case, it is an empty object
  args: {},

  // Define the handler function that will execute when the query is invoked
  handler: async (ctx) => {
    // Use the database context 'ctx' to query the "workspaces" collection and collect all documents from it
    return await ctx.db.query("workspaces").collect();
  }
});