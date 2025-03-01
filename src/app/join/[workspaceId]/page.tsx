"use client";

import React, { useMemo, useEffect } from "react";
import Image from "next/image";
import VerificationInput from "react-verification-input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useGetWorkSpaceInfo } from "@/features/workspaces/api/use-get-workspace-info";
import { Loader } from "lucide-react";
import { useJoin } from "@/features/workspaces/api/use-join";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const JoinPage = () => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();

  const { mutate, isPending } = useJoin();

  const { data, isLoading } = useGetWorkSpaceInfo({ id: workspaceId });

  // Ensure `data` is defined before accessing `isMember`
  const isMember = useMemo(() => data?.isMember, [data]);
  console.log(data?.isMember);

  useEffect(() => {
    if (isMember) {
      // Use `router.replace` to navigate without adding a new history entry
      router.replace(`/workspace/${workspaceId}`);
    }
  }, [isMember, router, workspaceId]);

  // Add a loading state to handle the case when data is being fetched
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  const handleComplete = (value: string) => {
    mutate(
      {
        workspaceId,
        joinCode: value,
      },
      {
        onSuccess: () => {
          router.replace(`/workspace/${workspaceId}`);
          toast.success("Workspace Joined");
        },
        onError() {
          toast.error("Failed to join workspace");
        },
      }
    );
  };

  return (
    <div className="h-screen flex flex-col gap-y-8 items-center justify-center bg-white p-8 rounded-lg shadow-md">
      <Image src="/slack.svg" alt="Slack Logo" width={80} height={80} />
      <div className="flex flex-col gap-y-4 items-center justify-center max-w-md">
        <div className="flex flex-col gap-y-2 items-center justify-center">
          <h1 className="text-2xl font-bold">Join {data?.name}</h1>
          <p className="text-md text-muted-foreground">
            Enter workspace code to join
          </p>
        </div>
        <VerificationInput
          onComplete={handleComplete}
          length={6}
          classNames={{
            container: "flex m-4 gap-x-4",
            character:
              "uppercase h-auto rounded-md border border-grey-300 items-center justify-center text-lg font-medium text-grey-500",
            characterInactive: "bg-muted",
            characterSelected: "bg-white text-black",
            characterFilled: "bg-white text-black",
          }}
          autoFocus
        />
      </div>
      <div className="flex gap-x-4">
        <Button size="lg" variant="outline" asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default JoinPage;
