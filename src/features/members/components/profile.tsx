import { Button } from "@/components/ui/button";
import { Id } from "../../../../convex/_generated/dataModel";
import { useGetMember } from "../api/use-get-member";
import {
  AlertTriangle,
  ChevronsDownIcon,
  Loader,
  MailIcon,
  XIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useUpdateMember } from "../api/use-update-member";
import { useRemoveMember } from "../api/use-remove-member";
import { useCurrentMember } from "../api/use-current-members";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";

interface ProfileProps {
  memberId: Id<"members">;
  onClose: () => void;
}

export const Profile = ({ memberId, onClose }: ProfileProps) => {
  const router = useRouter();

  const workspaceId = useWorkspaceId();

  const [LeaveDialog, confirmLeave] = useConfirm(
    "Leave workspace",
    "Are you sure you want to leave this workspace"
  );
  const [RemoveDialog, confirmRemove] = useConfirm(
    "remove member",
    "Are you sure you want to remove this member"
  );
  const [UpdateDialog, confirmUpdate] = useConfirm(
    "Change role",
    "Are you sure you want to change this member's role"
  );

  const { data: currentMember, isLoading: isCurrentMemberLoading } =
    useCurrentMember({ workspaceId });
  const { data: member, isLoading } = useGetMember({ id: memberId });

  const { mutate: updateMember } = useUpdateMember();
  const { mutate: removeMember } = useRemoveMember();

  if (isLoading || isCurrentMemberLoading) {
    return (
      <div className="flex flex-col h-screen">
        <div className="h-[40px] flex justify-between items-center px-4 border-b">
          <p className="text-lg font-bold">Thread</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="h-full w-full flex items-center justify-center">
          <Loader className="animate-spin size-6" />
        </div>
      </div>
    );
  }

  if (!member || !currentMember) {
    return (
      <div className="h-screen flex-col gap-y-2 flex items-center justify-center">
        <AlertTriangle className="animate-pulse size-5" />
        <p className="text-sm text-muted-foreground">Profile not found</p>
      </div>
    );
  }

  const onRemove = async () => {
    const ok = await confirmRemove();
    if (!ok) return;
    removeMember(
      { id: memberId },
      {
        onSuccess: () => {
          toast.success("Member removed");
          onClose();
        },
        onError: () => {
          toast.error("Member removed");
        },
      }
    );
  };

  const onLeave = async () => {
    const ok = await confirmLeave();
    if (!ok) return;

    removeMember(
      { id: memberId },
      {
        onSuccess: () => {
          router.replace("/");
          toast.success("You left workspace");
          onClose();
        },
        onError: () => {
          toast.error("Failed to leave workspace");
        },
      }
    );
  };

  const onUpdate = async (role: "admin" | "member") => {
    const ok = await confirmUpdate();
    if (!ok) return;
    updateMember(
      { id: memberId, role },
      {
        onSuccess: () => {
          toast.success("Role updated");
          onClose();
        },
        onError: () => {
          toast.error("Failed to update role");
        },
      }
    );
  };

  const avatarFallback = member.user.name?.charAt(0).toUpperCase();
  return (
    <>
      <UpdateDialog />
      <RemoveDialog />
      <LeaveDialog />
      <div className="h-screen flex flex-col gap-y-3">
        {/* Header */}
        <div className="h-[35px] flex justify-between items-center px-4 border-b">
          <p className="text-lg font-bold">Thread</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>

        <div className="flex flex-col items-center justify-center p-4">
          <Avatar className="max-w-[256px] max-h-[256px]">
            <AvatarImage className="rounded-md" src={member.user.image} />
            <AvatarFallback className="bg-sky-500 aspect-square text-[90px] p-5 rounded-xl p-21 text-white">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex flex-col p-4">
          <p className="text-xl font-bold">{member.user.name}</p>
          {currentMember?.role === "admin" && currentMember._id !== memberId ? (
            <div className="flex items-center mt-4 gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full capitalize">
                    {member.role} <ChevronsDownIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuRadioGroup
                    value={member.role}
                    onValueChange={(role) =>
                      onUpdate(role as "admin" | "member")
                    }
                  >
                    <DropdownMenuRadioItem value="admin">
                      Admin
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="member">
                      Member
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button onClick={onRemove} variant="outline" className="w-full">
                Remove
              </Button>
            </div>
          ) : currentMember._id === memberId &&
            currentMember?.role !== "admin" ? (
            <div>
              <Button
                onClick={onLeave}
                variant="outline"
                className="w-full mt-3"
              >
                Leave
              </Button>
            </div>
          ) : null}
        </div>
        <Separator />
        <div className="flex flex-col p-4">
          <p className="text-s mb-4 font-bold">Contact Information</p>
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-md bg-muted flex items-center justify-center">
              <MailIcon className="size-4" />
            </div>
            <div className="flex flex-col">
              <p className="text-[13px] font-semibold text-muted-foreground">
                Email Address
              </p>
              <Link
                href={`mailto:${member.user.email}`}
                className="text-sm hover:underline text-[#1264ac]"
              >
                {member.user.email}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
