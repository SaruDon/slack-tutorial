import { useCreateMessage } from "@/features/messages/api/use-create-message";
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import dynamic from "next/dynamic";
import Quill from "quill";
import { useRef, useState } from "react";
import { Id } from "../../../../../../convex/_generated/dataModel";

// Update your dynamic import in ChatInput component
const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

type CreateMessageValues = {
  conversationId: Id<"conversations">;
  workspaceId: Id<"workspaces">;
  body: string;
  image?: Id<"_storage"> | undefined;
};

interface ChatInputProps {
  placeholder: string;
  conversationId: Id<"conversations">;
}

export const ChatInput = ({ placeholder, conversationId }: ChatInputProps) => {
  const editorRef = useRef<Quill | null>(null);
  const [isPending, setIsPending] = useState(false);

  const [editorKey, setEditorKey] = useState(0);

  const workspaceId = useWorkspaceId();
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
        conversationId,
        workspaceId,
        body,
        image: undefined, // Initialize image as undefined
      };

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
