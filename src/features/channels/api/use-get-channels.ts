import { useQuery } from "convex/react";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";

interface UseGetChannelsProps {
  workspaceId: Id<"workspaces">;
}

interface Channel {
  _id: Id<"channels">;
  _creationTime: number;
  workspaceId: Id<"workspaces">;
  name: string;
}

export const useGetChannels = ({ workspaceId }: UseGetChannelsProps) => {
  const data = useQuery(api.channels.get, { workspaceId }) as Channel[] | undefined;
  const isLoading = data === undefined;

  return { data, isLoading };
};
