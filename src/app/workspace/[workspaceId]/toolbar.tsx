import { Button } from "@/components/ui/button";
import { useGetWorkSpace } from "@/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Loader, Search, TriangleAlert } from "lucide-react";
import { Info } from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useState } from "react";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import Link from "next/link";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import { Id } from "../../../../convex/_generated/dataModel";

export const Toolbar = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { data } = useGetWorkSpace({ id: workspaceId });

  const [open, setOpen] = useState(false);

  const { data: channels, isLoading: isChannelsLoading } = useGetChannels({
    workspaceId,
  });

  const { data: members, isLoading: isMembersLoading } = useGetMembers({
    workspaceId,
  });

  if (isMembersLoading || isChannelsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const handleChannelSelect = (channelId: Id<"channels">) => {
    setOpen(false);
    router.push(`/workspace/${workspaceId}/channel/${channelId}`);
  };

  const handleMemberSelect = (memberId: Id<"members">) => {
    setOpen(false);
    router.push(`/workspace/${workspaceId}/member/${memberId}`);
  };

  return (
    <nav className="bg-[#481349] flex items-center justify-between h-10 p-1.5">
      <div className="flex-1" />
      <div className="min-w[280px] max-[642px] grow-[2] shrink">
        <Button
          onClick={() => setOpen(true)}
          size="sm"
          className="bg-accent/25 hover:bh-accent/25 w-full h-7 justify-start px-2"
        >
          <Search className="size-4 text-white mr-3" />
          <span>Search workspace {data?.name}</span>
        </Button>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <DialogTitle className="sr-only">
            Search commands and members
          </DialogTitle>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Channels">
              {channels?.map((channel) => (
                <CommandItem
                  key={channel._id}
                  onSelect={() => handleChannelSelect(channel._id)}
                >
                  <span># {channel.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Members">
              {members?.map((member) => (
                <CommandItem
                  key={member._id}
                  onSelect={() => handleMemberSelect(member._id)}
                >
                  <span>{member.user.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>
      <div className="ml-auto flex flex-1 items-center justify-end">
        <Button variant="transparent" size="iconSm">
          <Info className="size-5 text-white" />
        </Button>
      </div>
    </nav>
  );
};
