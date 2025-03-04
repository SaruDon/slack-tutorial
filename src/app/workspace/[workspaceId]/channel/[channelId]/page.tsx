"use client";

import { useGetChannel } from "@/features/channels/api/use-get-channel";
import { useChannelId } from "@/hooks/use-channel-id";
import { Loader, TriangleAlert } from "lucide-react";
import { Header } from "./Header";
import { ChatInput } from "./chat-input";
import { useGetMessages } from "@/features/messages/api/use-get-messages";
import { MessageList } from "@/components/message-list";

const ChannelPageId = () => {
  const channelId = useChannelId(); //gets channelId from params

  const { results, status, loadMore } = useGetMessages({ channelId });
  const { data: channel, isLoading: isChannelLoading } = useGetChannel({
    //gets channel from channelID
    id: channelId,
  });

  if (isChannelLoading || status === "LoadingFirstPage") {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="flex  flex-col h-screen items-center justify-center gap-y-6">
        <TriangleAlert className="size-7 animate-ping text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Channel not found</span>
      </div>
    );
  }

  return (
    <div className=" flex flex-col pb-10 h-screen gap-y-3">
      <Header title={channel.name} />
      <MessageList
        channelName={channel.name}
        channelCreationTime={channel._creationTime}
        data={results}
        loadMore={loadMore}
        isLoadingMore={status === "LoadingMore"}
        canLoadMore={status === "CanLoadMore"}
      />
      <ChatInput placeholder={`Message #${channel.name}`} />
    </div>
  );
};

export default ChannelPageId;
