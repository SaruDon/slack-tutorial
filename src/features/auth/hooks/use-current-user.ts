import { api } from "../../../../convex/_generated/api"; // Import the API generated by Convex
import { useQuery } from "convex/react";

// Custom hook to fetch and manage current user data
export const useCurrentUser = () => {
  // Fetch the current user data from the Convex API
  const data = useQuery(api.users.current);

  // Determine if the data is still loading by checking if it's undefined
  const isLoading = data === undefined;

  // Return the fetched data and a boolean indicating whether the data is loading
  return { data, isLoading };
}