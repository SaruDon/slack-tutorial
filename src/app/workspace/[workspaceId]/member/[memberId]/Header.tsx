import { Button } from "@/components/ui/button";
import { FaChevronDown } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

interface HeaderProps {
  memberName?: string;
  memberImage?: string;
  onClick?: () => void;
}

export const Header = ({
  memberImage,
  memberName = "Member",
  onClick,
}: HeaderProps) => {
  const avatarFallback = memberName.charAt(0).toUpperCase();

  return (
    <div className="bg-white border-b h-[48px] flex items-center px-4 overflow-hidden">
      <Button
        variant="ghost"
        className="flex items-center justify-start text-lg font-semibold px-2 h-full overflow-hidden w-auto"
        size="sm"
        onClick={onClick}
      >
        <Avatar className="size-6 rounded-md mr-2">
          <AvatarImage className="rounded-md" src={memberImage} />
          <AvatarFallback className="bg-sky-500 p-2 rounded-full text-white">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        <span className="flex items-center truncate">
          {memberName}
          <FaChevronDown className="size-2 ml-2" />
        </span>
      </Button>
    </div>
  );
};
