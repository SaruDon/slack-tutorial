import { defineSchema } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { auth } from "./auth";

const schema = defineSchema({
  ...authTables
})

export default schema