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

interface HeaderProps {
  title: string;
}

export const Header = ({ title }: HeaderProps) => {
  const router = useRouter();
  const [value, setValue] = useState(title);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();

  const { mutate: updateChannel, isPending: isUpdatePending } =
    useUpdateChannel();

  const { mutate: removeChannel, isPending: isRemovePending } =
    useRemoveChannel();

  const [ConfirmDialog, confirm] = useConfirm(
    "Delete this channel",
    "This action is irreversible"
  );

  const { data: member } = useCurrentMember({ workspaceId });

  const handleEditOpen = (value: boolean) => {
    if (member?.role !== "admin") {
      return;
    }
    setIsEditOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value.replace(/\s+/g, "-").toLowerCase();
    setValue(name);
  };

  const handleDelete = async () => {
    const ok = await confirm();
    if (!ok) return;

    removeChannel(
      {
        id: channelId,
      },
      {
        onSuccess: () => {
          router.replace(`/workspace/${workspaceId}`);
          setIsEditOpen(false);
          toast.success("Channel deleted");
        },
        onError: () => {
          toast.error("Failed to delete workspace");
        },
      }
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateChannel(
      {
        id: channelId,
        name: value,
      },
      {
        onSuccess: () => {
          setIsEditOpen(false);
          toast.success("Channel updated");
        },
        onError: () => {
          toast.error("Failed to upate channel");
        },
      }
    );
  };

  return (
    <div className="bg-white border-b h[52px] flex items-center px-4 overflow-hidden">
      <ConfirmDialog />
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="text-lg font-semibold px-2 overflow-hidden w-auto "
            size="sm"
          >
            <span className="truncate">#{title}</span>
            <FaChevronDown className="size-2.5 ml-2" />
          </Button>
        </DialogTrigger>
        <DialogContent className="p-0 bg-grey-50 overflow-hidden ">
          <DialogHeader className="p-4  border-b bg-white">
            <DialogTitle className="mb-2"># {title}</DialogTitle>
            <div className="px-1 pb-4 flex flex-col gap-y-2.5">
              <Dialog open={isEditOpen} onOpenChange={handleEditOpen}>
                <div className="px-4 py-4 bg-white border rounded-lg cursor-pointer hover:bg-grey-50 gap-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm">Channel name</p>
                    <DialogTrigger>
                      {member?.role === "admin" && (
                        <p className="text-[#1264ae] text-sm  font-semibold hover:underline">
                          Edit
                        </p>
                      )}
                    </DialogTrigger>
                  </div>
                  <p className="text-sm"># {title}</p>
                </div>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Rename this Channel</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      value={value}
                      onChange={handleChange}
                      disabled={isUpdatePending}
                      required
                      autoFocus
                      minLength={3}
                      maxLength={80}
                      placeholder="e.g. plan-budget"
                    />
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline" disabled={isUpdatePending}>
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button disabled={isUpdatePending}>Save</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              {member?.role == "admin" && (
                <button
                  onClick={handleDelete}
                  className="flex items-start gap-x-2 px-5 py-4 bg-white rounded-lg cursor-pointer text-rose-600 border hover:bg-grey-500"
                >
                  <TrashIcon className="size-4" />
                  <p className="text-sm">Delete Channel</p>
                </button>
              )}
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};
