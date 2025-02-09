import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IconType } from "react-icons/lib";
import { cn } from "@/lib/utils";

interface SidebarButtonProps {
  icon: LucideIcon | IconType;
  label: string;
  isActive?: boolean;
}

export const SidebarButton = ({
  icon: Icon,
  label,
  isActive,
}: SidebarButtonProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-y-.5 cursor-pointer group:">
      <Button
        className={cn(
          "size-9 p-2 group-hover:bg-accent/20",
          isActive && "bg-accent/20"
        )}
        variant="transparent"
      >
        <Icon className="size-9 text-white group-hover:scale-110 transition-all" />
      </Button>
      <span className="text-white text-[11px]">{label}</span>
    </div>
  );
};
