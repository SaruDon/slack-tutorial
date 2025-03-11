import { useQueryState } from "nuqs";

export const useParentMessageId = () => {
  // This hook retrieves the parent message ID from the query state.
  // It uses the `useQueryState` hook from the `nuqs` library to get the value of `parentMessageId`.
  return useQueryState("parentMessageId");
};
