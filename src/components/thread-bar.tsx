import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { formatDistanceToNow } from "date-fns";
import { ChevronRight } from "lucide-react";

interface ThreadBarProps {
  count?: number;
  image?: string;
  name?: string;
  timeStamp?: number;
  onClick?: () => void;
}

export const ThreadBar = ({
  count,
  image,
  timeStamp,
  onClick,
  name = "Member",
}: ThreadBarProps) => {
  console.log("count ", count);
  console.log("image ", image);
  console.log("timeStamp", timeStamp);
  if (!count || !image || !timeStamp) {
    return null;
  }

  const avatarFallback = name?.charAt(0).toUpperCase();

  return (
    <div>
      <button
        onClick={onClick}
        className="p-1 rounded-md hover:bg-white border border-transparent hover:border-border flex items-center justify-start group/thread-bar transition max-w-[600px]"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <Avatar className="size-5 rounded-md mr-1">
            <AvatarImage className="rounded-md" src={image} />
            <AvatarFallback className="bg-sky-500 p-2 rounded-full text-white">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-sky-700 hover:underline font-bold truncate">
            {count} {count > 1 ? "replies" : "reply"}
          </span>
          <span className="text-xs font-muted-foreground translate group-hover/thread-bar:hidden block">
            Last reply by {name}{" "}
            {formatDistanceToNow(timeStamp, { addSuffix: true })}
          </span>
          <span className="text-xs text-muted-foreground truncate group-hover/thread-bar:block hidden">
            view thread
          </span>
        </div>
        <ChevronRight className="size-4 text-muted-foreground ml-auto opacity-0 group-hover/thread-bar:opacity-100 transition-shrink-0" />
      </button>
    </div>
  );
};
