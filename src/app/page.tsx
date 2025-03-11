"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useGetWorkSpaces } from "@/features/workspaces/api/use-get-workspaces";
import { useMemo } from "react";
import { useEffect } from "react";
import { useCreateWorkSpaceModal } from "@/features/workspaces/store/use-create-workspace-modal";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

export default function Home() {
  const router = useRouter();

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
    }
  }, [workSpaceId, isLoading, open, setOpen, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <div></div>;
}
