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
  })
})

export default schema