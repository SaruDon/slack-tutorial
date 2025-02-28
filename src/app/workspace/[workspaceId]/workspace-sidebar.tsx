import { useCurrentMember } from "@/features/members/api/use-current-members";
import { useGetWorkSpace } from "@/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import {
  AlertTriangle,
  HashIcon,
  Loader,
  MessageSquareText,
} from "lucide-react";
import { WorkspaceHeader } from "./workspace-header";
import { Doc } from "../../../../convex/_generated/dataModel";
import { SidebarItem } from "./sidebare-item";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { WorkspaceSection } from "./workspace-section";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { UserItem } from "./user-item";
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal";

import { useChannelId } from "@/hooks/use-channel-id";

export const WorkspaceSidebar = () => {
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

  const { data: members, isLoading: membersIsLoading } = useGetMembers({
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
    <div className="flex flex-col bg-[#5e2c5f] h-full">
      <WorkspaceHeader
        workspace={workspace}
        isAdmin={member.role === "admin"}
      />
      <div className="flex flex-col m-t-3 px-2">
        <SidebarItem label="Threads" icon={MessageSquareText} id="threads" />
        <SidebarItem
          label="Dafts & Sent"
          icon={MessageSquareText}
          id="threads"
        />
      </div>
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
            />
          </div>
        ))}
      </WorkspaceSection>
    </div>
  );
};
