"use client";

import { useCreateOrGetConversation } from "@/features/conversations/api/use-create-or-get-conversation";
import { useMemberId } from "@/hooks/use-member-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Loader, TriangleAlert } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { toast } from "sonner";
import { Conversations } from "./Conversation";

const MemberIdPage = () => {
  const memberId = useMemberId();
  const workspaceId = useWorkspaceId();
  const [conversationId, setConversationId] =
    useState<Id<"conversations"> | null>();
  const { mutate, isPending } = useCreateOrGetConversation();

  useEffect(() => {
    mutate(
      {
        workspaceId,
        memberId,
      },
      {
        onSuccess: (data) => {
          setConversationId(data);
        },
        onError: () => {
          toast.error("Conversation Id not found");
        },
      }
    );
  }, [memberId, mutate, workspaceId]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!conversationId) {
    return (
      <div className="flex items-center justify-center h-full gap-2 ">
        <TriangleAlert className="size-6 animate-pulse text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Conversation Not found
        </span>
      </div>
    );
  }

  return <Conversations id={conversationId} />;
};

export default MemberIdPage;
