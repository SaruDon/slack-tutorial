import { MessageSquareIcon, Pencil, Smile, Trash } from "lucide-react";
import { Button } from "./ui/button";
import { Hint } from "./hint";
import { EmojiPopover } from "./emoji-popover";

interface ToolbarPorps {
  isAuthor: boolean;
  isPending: boolean;
  handleEdit: () => void;
  handleThread: () => void;
  handleDelete: () => void;
  handleReactions: (value: string) => void;
  hideThreadButton?: boolean;
}

export const Toolbar = ({
  isAuthor,
  isPending,
  handleEdit,
  handleThread,
  handleDelete,
  handleReactions,
  hideThreadButton,
}: ToolbarPorps) => {
  return (
    <div className="absoulte top-0 right-5">
      <div className="group-hover:opacity-100  opacity-0 transition-opacity bg-white border  rounded-md shadow-sm">
        {!hideThreadButton && (
          <Hint label="Reply in Thread">
            <Button variant="ghost" size="iconSm" disabled={isPending}>
              <MessageSquareIcon className="size-4" />
            </Button>
          </Hint>
        )}

        <Hint label=" Add Reaction">
          <EmojiPopover
            onEmojiSelect={(emoji) => handleReactions(emoji.native)}
          >
            <Button variant="ghost" size="iconSm" disabled={isPending}>
              <Smile className="size-4" />
            </Button>
          </EmojiPopover>
        </Hint>

        {isAuthor && (
          <Hint label="Edit Message">
            <Button variant="ghost" size="iconSm" disabled={isPending}>
              <Pencil className="size-4" />
            </Button>
          </Hint>
        )}
        {isAuthor && (
          <Hint label="Delete Message">
            <Button variant="ghost" size="iconSm" disabled={isPending}>
              <Trash className="size-4" />
            </Button>
          </Hint>
        )}
      </div>
    </div>
  );
};
