import { useGetWorkSpace } from "@/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import {
  AlertTriangle,
  HashIcon,
  Loader,
  MessageSquareText,
} from "lucide-react";
import { WorkspaceHeader } from "./workspace-header";
import { SidebarItem } from "./sidebar-item";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { WorkspaceSection } from "./workspace-section";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { UserItem } from "./user-item";
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal";
import { useChannelId } from "@/hooks/use-channel-id";
import { useMemberId } from "@/hooks/use-member-id";
import { useCurrentMember } from "@/features/members/api/use-current-members";

export const WorkspaceSidebar = () => {
  const memberId = useMemberId();
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();

  const [_open, setOpen] = useCreateChannelModal();

  const { data: member, isLoading: memberLoading } = useCurrentMember({
    workspaceId,
  });
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkSpace({
    id: workspaceId,
  });
  const { data: channels, isLoading: channelsIsLoading } = useGetChannels({
    workspaceId,
  });

  const { data: members } = useGetMembers({
    workspaceId,
  });

  if (workspaceLoading || memberLoading || channelsIsLoading) {
    return (
      <div className="flex flex-col bg-[#5e2c5f] h-screen items-center justify-center">
        <Loader className="size-5 animate-spin text-white" />
      </div>
    );
  }

  if (!workspace || !member) {
    return (
      <div className="flex flex-col gap-y-2 bg-[#5e2c5f] h-screen items-center justify-center">
        <AlertTriangle className="size-5 text-white" />
        <p>Workspace Not Found</p>
      </div>
    );
  }

  return (
    <div className="flex pb-10 flex-col bg-[#5e2c5f] h-full">
      <WorkspaceHeader
        workspace={workspace}
        isAdmin={member.role === "admin"}
      />
      <div className="flex flex-col mt-3 px-2">
        <SidebarItem label="Threads" icon={MessageSquareText} id="threads" />
        <SidebarItem
          label="Daft & Sent"
          icon={MessageSquareText}
          id="threads"
        />
      </div>
      <div
        className="flex-1 overflow-y-auto
      [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:bg-[#4a235a]
        [&::-webkit-scrollbar-thumb]:bg-[#6d3d6e]
        [&::-webkit-scrollbar-thumb]:rounded-full
        hover:[&::-webkit-scrollbar-thumb]:bg-[#7e4e7f]
        scrollbar-color-[#6d3d6e_#4a235a]"
      >
        <WorkspaceSection
          label="Channels"
          hint="New Channel"
          onNew={member.role === "admin" ? () => setOpen(true) : undefined}
        >
          {channels?.map((item) => (
            <SidebarItem
              key={item._id.toString()}
              label={item.name}
              icon={HashIcon}
              id={item._id.toString()}
              variant={channelId === item._id ? "active" : "default"}
            />
          ))}
        </WorkspaceSection>

        <WorkspaceSection
          label="Direct Message"
          hint="New Message"
          onNew={() => console.log("New Channel Clicked")}
        >
          {members?.map((item) => (
            <div key={item._id}>
              <UserItem
                key={item._id}
                id={item._id}
                label={item.user.name}
                image={item.user.image}
                variant={item._id === memberId ? "active" : "default"}
              />
            </div>
          ))}
        </WorkspaceSection>
      </div>
    </div>
  );
};
