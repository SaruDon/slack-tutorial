import { Button } from "@/components/ui/button";
import { Id } from "../../../../convex/_generated/dataModel";
import { AlertTriangle, Loader, XIcon } from "lucide-react";
import { UseGetMessage } from "../api/use-get-message";
import { Message } from "@/components/message";
import Quill from "quill";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";
import { useCreateMessage } from "../api/use-create-message";
import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useGetMessages } from "../api/use-get-messages";
import {
  differenceInMinutes,
  format,
  isToday,
  isValid,
  isYesterday,
} from "date-fns";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface ThreadProps {
  messageId: Id<"messages">;
  onClose: () => void;
}
const formatDateLabel = (dateStr: string) => {
  // Check if the dateStr is a valid date format
  const date = new Date(dateStr);

  if (isToday(date)) {
    return "Today";
  }

  if (isYesterday(date)) {
    return "Yesterday";
  }

  if (!isValid(date)) {
    return dateStr;
  }

  return format(date, "EEEE, MMMM d");
};

const TIME_BOUND = 2;

type CreateMessageValues = {
  channelId: Id<"channels">;
  workspaceId: Id<"workspaces">;
  parentMessageId: Id<"messages">;
  body: string;
  image?: Id<"_storage"> | undefined;
};

export const Thread = ({ messageId, onClose }: ThreadProps) => {
  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();

  const { data: message, isLoading: isMessageLoading } = UseGetMessage({
    id: messageId,
  });

  const editorRef = useRef<Quill | null>(null);

  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [editorKey, setEditorKey] = useState(0);

  const { mutate: createMessage } = useCreateMessage();
  const { mutate: generateUrl } = useGenerateUploadUrl();

  const { results, status, loadMore } = useGetMessages({
    channelId,
    parentMessageId: messageId,
  });

  const canLoadMore = status === "CanLoadMore";
  const isLoadingMore = status === "LoadingMore";

  const groupedMessages = results?.reduce(
    (groups, message) => {
      const date = new Date(message._creationTime);
      const dateKey = format(date, "yyyy-MM-dd");

      // If there is no array for this date key, create an empty array.
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }

      // Add the message to the array for this date key.
      // The unshift method is used to add the message at the beginning of the array.
      groups[dateKey].unshift(message);

      return groups;
    },
    {} as Record<string, typeof results>
  );

  const handleSubmit = async ({
    body,
    image,
  }: {
    body: string;
    image: File | null;
  }) => {
    try {
      setIsPending(true); // Indicate that the operation is in progress
      editorRef.current?.enable(false); // Disable the editor during upload
      console.log("messageId", messageId);

      const values: CreateMessageValues = {
        channelId,
        workspaceId,
        parentMessageId: messageId,
        body,
        image: undefined, // Initialize image as undefined
      };
      console.log("values", values);

      if (image) {
        // Step 1: Generate a URL for uploading the image
        const url = await generateUrl({}, { throwError: true });
        if (!url) {
          throw new Error("Url not found");
        }
        // Step 2: Upload the image to the generated URL
        const result = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": image.type }, // Set the correct MIME type
          body: image, // The image file to upload
        });

        if (!result.ok) throw new Error("Failed to upload image");

        // Step 3: Extract the storage ID from the response
        const { storageId } = await result.json();

        values.image = storageId; // Associate the image with the message
      }

      // Step 4: Create the message with the uploaded image (if any)
      await createMessage(values, {
        throwError: true, // Ensure errors are thrown
      });

      // Step 5: Reset the editor for the next message
      setEditorKey((prevKey) => prevKey + 1);
    } catch (error) {
      // Handle errors (e.g., display a notification)
      console.error("Error creating message:", error);
    } finally {
      setIsPending(false); // Indicate that the operation is complete
      editorRef.current?.enable(true); // Re-enable the editor
    }
  };

  if (isMessageLoading || status === "LoadingFirstPage") {
    return (
      <div className="flex flex-col h-screen">
        <div className="h-[40px] flex justify-between items-center px-4 border-b">
          <p className="text-lg font-bold">Thread</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="h-full w-full flex items-center justify-center">
          <Loader className="animate-spin size-6" />
        </div>
      </div>
    );
  }

  if (!message || !message.memberId) {
    return (
      <div className="h-screen flex-col gap-y-2 flex items-center justify-center">
        <AlertTriangle className="animate-pulse size-5" />
        <p className="text-sm text-muted-foreground">Message not found</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col  gap-y-3">
      {/* Header */}
      <div className="h-[35px] flex justify-between items-center px-4 border-b">
        <p className="text-lg font-bold">Thread</p>
        <Button onClick={onClose} size="iconSm" variant="ghost">
          <XIcon className="size-5 stroke-[1.5]" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col-reverse message-scrollbar">
        {Object.entries(groupedMessages || {}).map(([dateKey, messages]) => (
          <div key={dateKey}>
            <div className="text-center my-2 relative">
              <hr className="absolute top-1/2 left-0 right-0 border-t border-grey-300" />
              <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-grey-300">
                {formatDateLabel(dateKey)}
              </span>
            </div>
            {messages.map((message, index) => {
              const previousMessage = messages[index - 1];

              const isCompact =
                previousMessage &&
                previousMessage.user._id === message.user._id &&
                differenceInMinutes(
                  new Date(message._creationTime),
                  new Date(previousMessage._creationTime)
                ) < TIME_BOUND;

              return (
                <Message
                  key={message._id}
                  id={message._id}
                  memberId={message.memberId}
                  authorImage={message.user.image}
                  authorName={message.user.name}
                  isAuthor={message.memberId === message.memberId}
                  reactions={message.reactions}
                  body={message.body}
                  image={message.image}
                  updatedAt={message.updatedAt}
                  createdAt={message._creationTime}
                  isEditing={editingId === message._id}
                  setEditing={setEditingId}
                  isCompact={isCompact}
                  hideThreadButton
                  threadCount={message.threadCount}
                  threadImage={message.threadImage}
                  threadTimestamp={message.threadTimestamp}
                />
              );
            })}
          </div>
        ))}

        <Message
          hideThreadButton
          memberId={message.memberId}
          authorName={message.user.name}
          authorImage={message.user.image}
          isAuthor={false}
          body={message.body}
          image={message.image}
          createdAt={message._creationTime}
          updatedAt={message.updatedAt}
          id={message._id}
          reactions={message.reactions}
          isEditing={false}
          setEditing={() => {}}
        />
      </div>

      {/* Editor */}
      <div className="px-5 w-full mb-10">
        <Editor
          key={editorKey}
          onSubmit={handleSubmit}
          innerRef={editorRef}
          disabled={isPending}
          placeholder="reply"
        />
      </div>
    </div>
  );
};
