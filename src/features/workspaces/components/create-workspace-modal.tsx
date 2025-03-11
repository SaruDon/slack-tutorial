"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateWorkSpaceModal } from "../store/use-create-workspace-modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateWorkspace } from "../api/use-create-workspaces";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

export const CreateWorkSpaceModal = () => {
  const router = useRouter();
  const [open, setOpen] = useCreateWorkSpaceModal();
  const [name, setName] = useState("");

  const { mutate, isPending } = useCreateWorkspace();

  const handleClose = () => {
    setOpen(false);
    setName("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(
      { name },
      {
        onSuccess(id) {
          toast("Workspace has been created");
          router.push(`/workspace/${id}`);
          handleClose();
        },
      }
    );
    // try {
    //   const data = await mutate(
    //     {
    //       name: "workspace 1",
    //     },
    //     {
    //       onSuccess(data) {
    //         // Router.push(`/workspaces/${data}`);
    //       },
    //       onError(error) {
    //         //show toast
    //       },
    //       onSettled() {
    //         //reset for
    //       },
    //     }
    //   );
    // } catch (error) {}
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add work Space</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={name}
            disabled={false}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
            minLength={3}
            placeholder="Workspace name e.g 'Work','Personal,'Home'"
          />
          <div className="flex  justify-end">
            <Button disabled={isPending}>Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
