import { useWorkspaceId } from './../src/features/hooks/use-workspace-id';
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




export const getById = query({
  args: { id: v.id("workspaces") }, // Define the arguments here
  handler: async (ctx, args) => {
    // Access the args directly within this scope
    const userId = await auth.getUserId(ctx)

    if (!userId) {
      throw new Error("Unauthorized")
    }

    const workspace = ctx.db.get(args.id); // Use the correctly destructured variable

    if (!workspace) {
      throw new Error(`Workspace with ID ${args.id} not found`);
    }

    return workspace;
  }
});


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