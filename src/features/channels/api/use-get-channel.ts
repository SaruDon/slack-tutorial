import { useQuery } from "convex/react";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";

interface UseGetChannelProps {
  id: Id<"channels">;
}

interface Channel {
  _id: Id<"channels">;
  _creationTime: number;
  workspaceId: Id<"workspaces">;
  name: string;
}

export const useGetChannel = ({ id }: UseGetChannelProps) => {
  const data = useQuery(api.channels.getById, { id }) as Channel | undefined; // Remove array type
  const isLoading = data === undefined;

  return { data, isLoading };
};
