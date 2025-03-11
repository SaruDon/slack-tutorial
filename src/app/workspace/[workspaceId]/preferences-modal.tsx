"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRemoveWorkspace } from "@/features/workspaces/api/use-remove-workspaces copy";
import { useUpdateWorkspace } from "@/features/workspaces/api/use-update-workspaces";
import { TrashIcon } from "lucide-react";
import { useState } from "react";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/hooks/use-confirm";

interface PreferencesModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialvalue: string;
}

export const PreferencesModal = ({
  open,
  setOpen,
  initialvalue,
}: PreferencesModalProps) => {
  const router = useRouter();

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure",
    "This action is irreversible"
  );

  const workspaceId = useWorkspaceId();

  const [value, setValue] = useState(initialvalue);
  const [editOpen, setEditOpen] = useState(false);

  const { mutate: updateWorkspace, isPending: isUpdatatingworkspcae } =
    useUpdateWorkspace();

  const { mutate: removeWorkspace, isPending: isRemovingworkspcae } =
    useRemoveWorkspace();

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateWorkspace(
      {
        id: workspaceId,
        name: value,
      },
      {
        onSuccess: () => {
          setEditOpen(false);
          toast.success("Workspace updated");
        },
        onError: () => {
          toast.error("Failed to upate workspace");
        },
      }
    );
  };

  const handleRemove = async () => {
    const ok = await confirm();
    if (!ok) return;

    removeWorkspace(
      {
        id: workspaceId,
      },
      {
        onSuccess: () => {
          router.replace("/");
          setEditOpen(false);
          toast.success("Workspace updated");
        },
        onError: () => {
          toast.error("Failed to upate workspace");
        },
      }
    );
  };

  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 bg-gray-100 overflow-hidden">
          <DialogHeader className="p-4 border-b bg-white">
            <DialogTitle>{value}</DialogTitle>
          </DialogHeader>
          <div className="px-4 pb-4 flex flex-col gap-y-2">
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-100">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Workspace name</p>
                    <p className="text-sm text-[#1264a3] hover:underline font-semibold">
                      Edit
                    </p>
                  </div>
                  <p className="text-sm">{value}</p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rename this workspace</DialogTitle>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleEdit}>
                  <Input
                    value={value}
                    disabled={isUpdatatingworkspcae}
                    onChange={(e) => setValue(e.target.value)}
                    required
                    autoFocus
                    maxLength={80}
                    minLength={3}
                    placeholder="Workspace name e.g 'Work','Personal,'Home'"
                  />
                  <DialogFooter>
                    <div className="flex gap-2 justify-end">
                      <DialogClose asChild>
                        <Button
                          variant="outline"
                          disabled={isUpdatatingworkspcae}
                        >
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button disabled={isUpdatatingworkspcae}>Save</Button>
                    </div>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <button
              disabled={isRemovingworkspcae}
              onClick={handleRemove}
              className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-grey-50 text-rose-600"
            >
              <TrashIcon className="size-4" />
              <p className="text-sm font-semibold">Delete workspace</p>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
