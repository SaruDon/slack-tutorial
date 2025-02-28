"use client";
import { useMemo, useEffect } from "react";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal";
import { useGetWorkSpace } from "@/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useRouter } from "next/navigation";
import { TriangleAlert } from "lucide-react";

const WorkspaceIdPage = () => {
  const router = useRouter();
  const [open, setOpen] = useCreateChannelModal();
  const workspaceId = useWorkspaceId();

  const { data: workspace, isLoading: isWorkspaceLoading } = useGetWorkSpace({
    id: workspaceId,
  });

  const { data: channel, isLoading: isChannelLoading } = useGetChannels({
    workspaceId,
  });

  const channelId = useMemo(() => channel?.[0]?._id, [channel]);

  useEffect(() => {
    if (isChannelLoading || isWorkspaceLoading || !workspace) {
      return;
    }
    if (channelId) {
      router.push(`/workspace/${workspaceId}/channel/${channelId}`);
    } else if (!open) {
      setOpen(true);
    }
  }, [
    channelId,
    isChannelLoading,
    isChannelLoading,
    workspace,
    open,
    setOpen,
    router,
  ]);

  if (isChannelLoading || isWorkspaceLoading) {
    return (
      <div className="flex items-center justify-center flex-1 gap-2 h-screen">
        <TriangleAlert className="size-6 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Workspace Not found
        </span>
      </div>
    );
  }

  return <div>workspace</div>;
};
export default WorkspaceIdPage;
