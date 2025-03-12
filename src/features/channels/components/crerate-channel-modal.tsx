import React, { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useCreateChannelModal } from "../store/use-create-channel-modal";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateChannel } from "../api/use-create-channel";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useRouter } from "next/navigation";

export const CreateChannelModal = () => {
  const router = useRouter();
  const [open, setOpen] = useCreateChannelModal();

  const { mutate, isPending } = useCreateChannel();

  const workspaceId = useWorkspaceId();

  const handleClose = () => {
    setName("");
    setOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
    setName(value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(
      { name, workspaceId },
      {
        onSuccess: (id) => {
          toast.success("New channel created");
          router.push(`/workspace/${workspaceId}/channel/${id}`);
          handleClose();
        },
        onError: () => {
          toast.error("Failed to create new channel");
        },
      }
    );
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      handleClose();
    }
  };

  const [name, setName] = useState("");
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a Title</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={name}
            disabled={isPending}
            onChange={handleChange}
            required
            autoFocus
            minLength={3}
            maxLength={80}
            placeholder="eg-buget-planner"
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
