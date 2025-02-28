// Import the query function from the generated server module
import { mutation, query } from "./_generated/server";
import { v } from "convex/values"
import { auth } from "./auth";


const generateCode = () => {
  const characters = "0123456789abcdefghijklmnopqrstuvwxyz"; // Fixed the letters
  const code = Array.from({ length: 6 }, () =>
    characters[Math.floor(Math.random() * characters.length)] // Use dynamic length
  ).join('');
  return code;
};

export const getInfoById = query({
  args: { id: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx)
    if (!userId) {
      throw new Error("Unauthorized")
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) => q.eq("workspaceId", args.id).eq("userId", userId))
      .unique()
    const workspace = await ctx.db.get(args.id)
    return { name: workspace?.name, isMember: !!member };
  }
})


export const join = mutation({
  args: {
    joinCode: v.string(),
    workspaceId: v.id("workspaces")
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx)
    if (!userId) {
      throw new Error("Unauthorized")
    }

    const workspace = await ctx.db.get(args.workspaceId)

    if (!workspace) {
      throw new Error("Workspace not found")
    }

    if (workspace.joinCode !== args.joinCode.toLocaleLowerCase()) {
      throw new Error("Join code is incorrect")
    }

    const existingMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) => q.eq("workspaceId", args.workspaceId).eq("userId", userId))
      .unique()

    if (existingMember) {
      throw new Error("Already part of workspace")
    }

    await ctx.db.insert("members", {
      userId,
      workspaceId: workspace._id,
      role: "member"
    })

    return workspace._id
  }
})

export const newJoinCode = mutation({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized")
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) => q.eq("workspaceId", args.workspaceId).eq("userId", userId))
      .unique()

    if (!member || member.role !== "admin") {
      throw new Error("unauthorized")
    }

    const joinCode = generateCode()

    await ctx.db.patch(args.workspaceId, {
      joinCode
    })

    return args.workspaceId;
  }
})

export const create = mutation({
  args: {
    name: v.string()
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx)
    if (!userId) {
      throw new Error("user not Loggedin")
    }

    const joinCode = generateCode();

    const workspaceId = await ctx.db.insert("workspaces", {
      name: args.name,
      userId,
      joinCode
    })

    await ctx.db.insert("members", { userId, workspaceId, role: "admin" })

    const workspace = await ctx.db.get(workspaceId)
    console.log('workSpace', workspace)

    await ctx.db.insert("channels", {
      name: "general",
      workspaceId
    })

    return workspaceId
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


    const memeber = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) => q.eq("workspaceId", args.id).eq("userId", userId))
      .unique

    if (!memeber) {
      return null
    }

    // const workspace = ctx.db.get(args.id); // Use the correctly destructured variable

    // if (!workspace) {
    //   throw new Error(`Workspace with ID ${args.id} not found`);
    // }

    return ctx.db.get(args.id);;
  }
});


// Define a query named 'get' which will be used to fetch data from the database
export const get = query({
  // Specify the arguments required for this query, but in this case, it is an empty object
  args: {},

  // Define the handler function that will execute when the query is invoked
  handler: async (ctx) => {
    // Use the database context 'ctx' to query the "workspaces" collection and collect all documents from it
    const userId = await auth.getUserId(ctx)
    if (!userId) {
      return [];
    }

    const members = await ctx.db
      .query("members")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .collect()

    const workspaceIds = members.map((member) => member.workspaceId)

    const workspaces = []

    for (const workspaceId of workspaceIds) {
      const workspace = await ctx.db.get(workspaceId)
      if (workspace) {
        workspaces.push(workspace)
      }
    }

    return workspaces;
  }
});


export const update = mutation({
  args: {
    id: v.id("workspaces"),
    name: v.string()
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx)

    if (!userId) {
      throw new Error("Unauthorized")
    }


    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) => q.eq("workspaceId", args.id).eq("userId", userId))
      .unique

    // if (!member || member.role !== "admin") {
    //   throw new Error("Unauthorized")
    // }
    console.log('member', member)

    if (!member) {
      console.log('member', member)
      throw new Error("Unauthorized")
    }
    await ctx.db.patch(args.id, {
      name: args.name
    })
    return args.id;
  },
})

export const remove = mutation({
  args: {
    id: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx)

    if (!userId) {
      throw new Error("Unauthorized")
    }


    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) => q.eq("workspaceId", args.id).eq("userId", userId))
      .unique

    // if (!member || member.role !== "admin") {
    //   throw new Error("Unauthorized")
    // }

    if (!member) {
      console.log('member', member)
      throw new Error("Unauthorized")
    }

    const [members] = await Promise.all([
      ctx.db
        .query("members")
        .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.id))
        .collect()
    ])

    for (const member of members) { //delete all members of that channel and then that channel
      await ctx.db.delete(member._id)
    }

    await ctx.db.delete(args.id); //delete workspace 

    return args.id;
  },
})