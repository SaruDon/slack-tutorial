import { useCreateMessage } from "@/features/messages/api/use-create-message";
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";
import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import dynamic from "next/dynamic";
import Quill from "quill";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Id } from "../../../../../../convex/_generated/dataModel";

// Update your dynamic import in ChatInput component
const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

type CreateMessageValues = {
  channelId: Id<"channels">;
  workspaceId: Id<"workspaces">;
  body: string;
  image?: Id<"_storage"> | undefined;
};

interface ChatInputProps {
  placeholder: string;
}

export const ChatInput = ({ placeholder }: ChatInputProps) => {
  const editorRef = useRef<Quill | null>(null);
  const [isPending, setIsPending] = useState(false);

  const [editorKey, setEditorKey] = useState(0);

  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();
  const { mutate: createMessage } = useCreateMessage();

  const { mutate: generateUrl } = useGenerateUploadUrl();

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

      const values: CreateMessageValues = {
        channelId,
        workspaceId,
        body,
        image: undefined, // Initialize image as undefined
      };

      console.log("image", image);

      if (image) {
        // Step 1: Generate a URL for uploading the image
        const url = await generateUrl({}, { throwError: true });
        if (!url) {
          throw new Error("Url not found");
        }
        console.log("url", url);
        // Step 2: Upload the image to the generated URL
        const result = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": image.type }, // Set the correct MIME type
          body: image, // The image file to upload
        });

        if (!result.ok) throw new Error("Failed to upload image");

        console.log("result", result);
        // Step 3: Extract the storage ID from the response
        const { storageId } = await result.json();
        console.log("first", storageId);

        values.image = storageId; // Associate the image with the message
      }

      console.log("values", { values });

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

  return (
    <div className="px-5 w-full">
      <Editor
        key={editorKey}
        placeholder={placeholder}
        onSubmit={handleSubmit}
        disabled={isPending}
        innerRef={editorRef}
      />
    </div>
  );
};
