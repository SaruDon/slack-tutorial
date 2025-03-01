"use client";
import { useMemo, useEffect } from "react";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal";
import { useGetWorkSpace } from "@/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useRouter } from "next/navigation";
import { Loader, TriangleAlert } from "lucide-react";
import { useCurrentMember } from "@/features/members/api/use-current-members";

const WorkspaceIdPage = () => {
  const router = useRouter();
  const [open, setOpen] = useCreateChannelModal();
  const workspaceId = useWorkspaceId();

  const { data: member, isLoading: isMemberLoading } = useCurrentMember({
    workspaceId,
  });

  const { data: workspace, isLoading: isWorkspaceLoading } = useGetWorkSpace({
    id: workspaceId,
  });

  const { data: channel, isLoading: isChannelLoading } = useGetChannels({
    workspaceId,
  });

  const channelId = useMemo(() => channel?.[0]?._id, [channel]);

  const isAdmin = useMemo(() => member?.role === "admin", [member]);

  useEffect(() => {
    if (
      isChannelLoading ||
      isWorkspaceLoading ||
      !workspace ||
      isMemberLoading ||
      !member
    ) {
      return;
    }
    if (channelId) {
      router.push(`/workspace/${workspaceId}/channel/${channelId}`);
    } else if (!open && isAdmin) {
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
    isMemberLoading,
    member,
    isAdmin,
  ]);

  if (isChannelLoading || isWorkspaceLoading || isMemberLoading) {
    return (
      <div className="flex items-center justify-center flex-1 gap-2 ">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!workspace || !member) {
    return (
      <div className="flex items-center justify-center flex-1 gap-2 ">
        <TriangleAlert className="size-6 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Workspace Not found
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center flex-1 gap-2 h-screen">
      <TriangleAlert className="size-6 animate-ping text-muted-foreground" />
      <span className="text-sm text-muted-foreground">No Channel Found</span>
    </div>
  );
};
export default WorkspaceIdPage;
