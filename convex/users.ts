// Import necessary functions and modules from convex/server and auth
import { query } from "./_generated/server";
import { auth } from "./auth";

// Define a query function named 'current' that retrieves user information
export const current = query({
  // The arguments for this query are empty (no input is required)
  args: {},

  // Define the handler function to execute when the query is called
  handler: async (ctx) => {
    // Attempt to get the user ID from the authentication context
    const userId = await auth.getUserId(ctx);

    // If no user ID is found, return null
    if (userId === null) {
      return null;
    }

    // If a user ID is found, retrieve and return the corresponding user data from the database
    return ctx.db.get(userId);
  }
});