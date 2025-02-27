"use client";

import { CreateWorkSpaceModal } from "@/features/workspaces/components/create-workspace-modal";
import { CreateChannelModal } from "@/features/channels/components/crerate-channel-modal";
import { useState } from "react";
import { useEffect } from "react";

export const Modal = () => {
  const [mount, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mount) {
    return null;
  }

  return (
    <>
      <CreateChannelModal />
      <CreateWorkSpaceModal />
    </>
  );
};
