import { format, isToday, isYesterday } from "date-fns";
import { Doc, Id } from "../../convex/_generated/dataModel";

import dynamic from "next/dynamic";
import { Hint } from "./hint";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Span } from "next/dist/trace";
import { Thumbnail } from "./thumbnail";

const Renderer = dynamic(() => import("@/components/renderer"), { ssr: false });

interface MessageProps {
  id: Id<"messages">;
  memberId: Id<"members">;
  authorImage?: string;
  authorName?: string;
  isAuthor: boolean;
  reactions: Array<
    Omit<Doc<"reactions">, "memberId"> & {
      count: number;
      memberIds: Id<"members">[];
    }
  >;
  body: Doc<"messages">["body"];
  image: string | null | undefined;
  createdAt: Doc<"messages">["_creationTime"];
  updatedAt: Doc<"messages">["updatedAt"];
  isEditing: boolean;
  isCompact?: boolean;
  setEditng: (id: Id<"messages">) => void;
  hideThreadButton?: boolean;
  threadCount?: number;
  thredImage?: string;
  thredTimestamp?: number | undefined;
}

// format(date, "dd:m:yyyy:hh:mm:ss")

const formatFullTime = (date: Date) => {
  return `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMM d,yyyy")} at ${format(date, "h:mm:ss a")}`;
};

export const Message = ({
  id,
  memberId,
  isAuthor,
  authorImage,
  authorName = "Member",
  reactions,
  body,
  image,
  createdAt,
  updatedAt,
  isEditing,
  isCompact,
  setEditng,
  hideThreadButton,
  threadCount,
  thredImage,
  thredTimestamp,
}: MessageProps) => {
  const avatarFallback = authorName.charAt(0).toLowerCase();

  // Use compact mode if the user sends a message within very short interval
  // This means the next message will use the compact layout
  if (isCompact) {
    return (
      <div className="flex flex-col gap-2 p-1.5 px-2.5 hover:bg-gray-100/60 group relative">
        <div className="flex items-start gap-2">
          <Hint label={formatFullTime(new Date(createdAt))}>
            <button className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-22 text-center hover:underline">
              {format(new Date(createdAt), "hh:mm")}
            </button>
          </Hint>
          <div className="flex flex-col w-full">
            <Renderer value={body} />
            <Thumbnail url={image} />
            {updatedAt ? (
              <span className="text-xs text-muted-foreground">(edited)</span>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-1.5  hover:bg-gray-100/60 group relative">
      <div className="flex items-start gap-2">
        <button>
          <Avatar className="rounded-md">
            <AvatarImage className="size-10 rounded-full" src={authorImage} />
            <AvatarFallback className="bg-sky-500 px-3 rounded-full text-[32px] text-white">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
        </button>
        <div className="flex flex-col  overflow-hidden">
          <div className="text-l">
            <button
              onClick={() => {}}
              className="font-bold text-primary hover:underline"
            >
              {authorName}
            </button>
            <span>&nbsp; &nbsp;</span>
            <Hint label={formatFullTime(new Date(createdAt))}>
              <button className="text-xs text-muted-foreground hover:underline">
                {format(new Date(createdAt), "h:mm a")}
              </button>
            </Hint>
          </div>
          <Renderer value={body} />
          <Thumbnail url={image} />
          {updatedAt ? (
            <span className="text-xs text-muted-foreground">(edited)</span>
          ) : null}
        </div>
      </div>
    </div>
  );
};
