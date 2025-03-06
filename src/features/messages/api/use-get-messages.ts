import { usePaginatedQuery } from "convex/react";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";

const BATCH_SIZE = 3;

interface UseGetMessagePros {
  channelId?: Id<"channels">;
  parentMessageId?: Id<"messages">
  conversationId?: Id<"conversations">
}

export type GetMessagesReturnType = typeof api.messages.get._returnType["page"];

export const useGetMessages = ({ channelId, parentMessageId, conversationId }: UseGetMessagePros) => {
  const { results, status, loadMore } = usePaginatedQuery(
    api.messages.get,
    {
      channelId, conversationId, parentMessageId
    },
    { initialNumItems: BATCH_SIZE }
  )

  return {
    results,
    status,
    loadMore: () => loadMore(BATCH_SIZE)
  }
}