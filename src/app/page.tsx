"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { UserButton } from "@/features/auth/components/user-button";
import { useGetWorkSpaces } from "@/features/workspaces/api/use-get-workspaces";
import { useMemo } from "react";
import { useEffect } from "react";
import { useCreateWorkSpaceModal } from "@/features/workspaces/store/use-create-workspace-modal";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const { signOut } = useAuthActions();
  const { data, isLoading } = useGetWorkSpaces();
  const workSpaceId = useMemo(() => data?.[0]?._id, [data]);

  const [open, setOpen] = useCreateWorkSpaceModal();

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (workSpaceId) {
      router.replace(`/workspace/${workSpaceId}`);
    } else if (!open) {
      setOpen(true);
      console.log("Open creation model");
    }
  }, [workSpaceId, isLoading, open, setOpen, router]);

  return <div></div>;
}
