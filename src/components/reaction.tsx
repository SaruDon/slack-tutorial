import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Doc, Id } from "../../convex/_generated/dataModel";
import { useCurrentMember } from "@/features/members/api/use-current-members";
import { cn } from "@/lib/utils";
import { EmojiPopover } from "./emoji-popover";
import { MdOutlineAddReaction } from "react-icons/md";
import { Hint } from "./hint";

//! The Omit utility type in TypeScript is used to create a new type
// by omitting one or more properties from an existing type.
// It's particularly useful when you want to derive a new type from
// an existing one but exclude certain properties

interface ReactionsProps {
  data: Array<
    Omit<Doc<"reactions">, "memberId"> & {
      count: number;
      memberIds: Id<"members">[];
    }
  >;
  onChange: (value: string) => void;
}

export const Reactions = ({ data, onChange }: ReactionsProps) => {
  const workspaceId = useWorkspaceId();
  const { data: currentMember } = useCurrentMember({ workspaceId });
  // const currentMemberId = data.

  if (!currentMember || data.length === 0) {
    return;
  }

  return (
    <div className="flex items-center gap-1 mt-1 mb-1">
      {data.map((reaction) => (
        <Hint
          key={reaction._id}
          label={`${reaction.count}  ${reaction.count === 1 ? "person" : "people"} reacted with ${reaction.value}`}
        >
          <button
            onClick={() => onChange(reaction.value)}
            className={cn(
              "h-6 px-2 rounded-full bg-slate-200/70 border border-transparent text-slate-800 flex items-center gap-x-2",
              reaction.memberIds.includes(currentMember._id) &&
                "bg-blue-100/70 border-blue-500 text-white"
            )}
          >
            {reaction.value}
            <span
              className={cn(
                "text-xs font-semibold text-muted-foreground",
                reaction.memberIds.includes(currentMember._id) &&
                  "bg-blue-100/70 border-blue-500 text-blue-500"
              )}
            >
              {reaction.count}
            </span>
          </button>
        </Hint>
      ))}
      <EmojiPopover
        hint="Add Reaction"
        onEmojiSelect={(emoji) => onChange(emoji.native)}
      >
        <button className="h-7 rounded-full bg-slate-200/70 border border-transparent hover:border-slate-500 text-slate-800 flex px-3 items-center gap-x-1">
          <MdOutlineAddReaction />
        </button>
      </EmojiPopover>
    </div>
  );
};
