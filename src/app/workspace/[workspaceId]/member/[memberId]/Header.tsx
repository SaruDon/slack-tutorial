import { Button } from "@/components/ui/button";
import { FaChevronDown } from "react-icons/fa";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TrashIcon } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { DialogClose } from "@radix-ui/react-dialog";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useUpdateChannel } from "@/features/channels/api/use-update-channel";
import { useChannelId } from "@/hooks/use-channel-id";
import { useRemoveChannel } from "@/features/channels/api/use-remove-channel";
import { useConfirm } from "@/hooks/use-confirm";
import { useRouter } from "next/navigation";
import { useCurrentMember } from "@/features/members/api/use-current-members";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

interface HeaderProps {
  memberName?: string;
  memberImage?: string;
  onClick?: () => void;
}

export const Header = ({
  memberImage,
  memberName = "Member",
  onClick,
}: HeaderProps) => {
  const avatarFallback = memberName.charAt(0).toUpperCase();

  return (
    <div className="bg-white border-b h-[48px] flex items-center px-4 overflow-hidden">
      <Button
        variant="ghost"
        className="flex items-center justify-start text-lg font-semibold px-2 h-full overflow-hidden w-auto"
        size="sm"
        onClick={onClick}
      >
        <Avatar className="size-6 rounded-md mr-2">
          <AvatarImage className="rounded-md" src={memberImage} />
          <AvatarFallback className="bg-sky-500 p-2 rounded-full text-white">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        <span className="flex items-center truncate">
          {memberName}
          <FaChevronDown className="size-2 ml-2" />
        </span>
      </Button>
    </div>
  );
};
