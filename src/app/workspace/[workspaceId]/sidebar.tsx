import { UserButton } from "@/features/auth/components/user-button";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { SidebarButton } from "./sidebar-button";
import { Bell, Home, MessageSquareIcon, MoreHorizontal } from "lucide-react";
import { usePathname } from "next/navigation";

export const Sidebar = () => {
  const pathName = usePathname();

  return (
    <aside className="w-[70px] h-screen bg-[#481349] flex flex-col gap-y-4 items-center pt-[9px] pb-[4px]">
      <WorkspaceSwitcher />
      <SidebarButton
        icon={Home}
        label="Home"
        isActive={pathName.includes("/workspace")}
      />
      <SidebarButton icon={MessageSquareIcon} label="DMs" isActive={false} />
      <SidebarButton icon={Bell} label="Activity" isActive={false} />
      <SidebarButton icon={MoreHorizontal} label="More" isActive={false} />

      <div className="flex flex-col items-center justify-center gap-y-1 mt-auto">
        <UserButton></UserButton>
      </div>
    </aside>
  );
};
