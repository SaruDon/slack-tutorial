"use client";

import { useState } from "react";
import { ChevronDown, ListFilter, SquarePen } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import React from "react";
import { Doc } from "../../../../convex/_generated/dataModel";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Hint } from "@/components/hint";

import { PreferencesModal } from "./preferences-modal";
import { InviteModal } from "./invite-modal";

interface WorkspaceHeaderProps {
  workspace: Doc<"workspaces">;
  isAdmin: boolean;
}

export const WorkspaceHeader = ({
  workspace,
  isAdmin,
}: WorkspaceHeaderProps) => {
  const [prefrencesOpen, setPrefrencesOpen] = useState(false);

  const [inviteOpen, setInviteOpen] = useState(false);

  return (
    <>
      <InviteModal
        open={inviteOpen}
        setOpen={setInviteOpen}
        name={workspace.name}
        joinCode={workspace.joinCode}
      />
      <PreferencesModal
        open={prefrencesOpen}
        setOpen={setPrefrencesOpen}
        initialvalue={workspace.name}
      />
      <div className="flex items-center justify-between px-4 h-[49px] gap-0.5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="transparent"
              className="font-semibold text-lg w-auto p-1.5 overflow-hidden"
              size="sm"
            >
              <span className="truncate">{workspace?.name}</span>
              <ChevronDown className="size-3 ml-4 shrink-0"></ChevronDown>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="start" className="w-64">
            <DropdownMenuItem className="cursor-pointer capitalize">
              <div className="size-9 relative overflow-hidden bg-[#616061] text-white text-xl font-semibold flex items-center justify-center rounded-md">
                {workspace?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col items-start">
                <p className="font-bold">{workspace?.name}</p>
                <p className="text-xs text-muted-foreground">
                  Active workspace
                </p>
              </div>
            </DropdownMenuItem>
            <Separator></Separator>
            {isAdmin && (
              <>
                <DropdownMenuItem
                  className="cursor-pointer py-2"
                  onClick={() => setInviteOpen(true)}
                >
                  Invite people to workspace
                </DropdownMenuItem>
                <Hint label="New Message" side="bottom">
                  <DropdownMenuItem
                    className="cursor-pointer py-2"
                    onClick={() => setPrefrencesOpen(true)}
                  >
                    Preferences
                  </DropdownMenuItem>
                </Hint>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex items-center gap-0.5">
          <Hint label="Filter conversations" side="bottom">
            <Button variant="transparent" size="iconSm">
              <ListFilter className="size-4" />
            </Button>
          </Hint>
          <Hint label="New message" side="bottom">
            <Button variant="transparent" size="iconSm">
              <SquarePen className="size-4" />
            </Button>
          </Hint>
        </div>
      </div>
    </>
  );
};
