import { Message } from './../../../components/message';
import { useQuery } from "convex/react";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";

interface UseGetMessageProps {
  id: Id<"messages">;
}



export const UseGetMessage = ({ id }: UseGetMessageProps) => {
  const data = useQuery(api.messages.getMessageById, { messageId: id })
  const isLoading = data === undefined;

  return { data, isLoading };
};
