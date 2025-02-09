import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useGetWorkSpace } from "@/features/workspaces/api/use-get-workspace";
import { useGetWorkSpaces } from "@/features/workspaces/api/use-get-workspaces";
import { useCreateWorkSpaceModal } from "@/features/workspaces/store/use-create-workspace-modal";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

export const WorkspaceSwitcher = () => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const [open, setOpen] = useCreateWorkSpaceModal();

  const { data: workspace, isLoading: workspaceLoading } = useGetWorkSpace({
    id: workspaceId,
  });
  const { data: workspaces, isLoading: workspacesLoading } = useGetWorkSpaces();

  const filteredWorkspaces = workspaces?.filter(
    (workspace) => workspace?._id !== workspaceId
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="size-9 relative overflow-hidden bg-[#ABABAD]  hover:bg-[#ABABAD]/80  text-slate-800 font-semibold text-xl">
          {workspaceLoading ? (
            <Loader className="size-5 animate-spin shrink-0" />
          ) : (
            workspace?.name.charAt(0).toUpperCase()
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="start" className="w-64">
        <DropdownMenuItem
          onClick={() => {
            router.push(`/workspace/${workspaceId}`);
          }}
          className=" text-l cursor-pointer flex flex-col justify-start items-start capitalize"
        >
          {workspace?.name}
          <span className="text-xs p-0 m-0 text-muted-foreground">
            {" "}
            Active work space
          </span>
        </DropdownMenuItem>
        {filteredWorkspaces?.map((workspace) => (
          <DropdownMenuItem
            key={workspace._id}
            className="cursor-pointer capitalize overflow-hidden"
            onClick={() => router.push(`/workspace/${workspace._id}`)}
          >
            <div className="rounded-sm size-9 relative overflow-hidden bg-[#474747] text-white font-semibold text-xl flex  items-center justify-center mr-2">
              {workspace.name.charAt(0).toLocaleUpperCase()}
            </div>
            <div className="trancate">{workspace.name}</div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem onClick={() => setOpen(true)}>
          <div className="size-9 relative overflow-hidden bg-[#f2f2f2] text-slate-800 font-semibold text-xl flex  items-center justify-center mr-2">
            <Plus />
          </div>
          Create new workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
