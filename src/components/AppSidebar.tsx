import { LayoutDashboard, CalendarClock, Plus, Video, History, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  activeView: "board" | "timeline" | "videos" | "history";
  onViewChange: (view: "board" | "timeline" | "videos" | "history") => void;
  onCreateTask: () => void;
  onSignOut: () => void;
}

export const AppSidebar = ({ activeView, onViewChange, onCreateTask, onSignOut }: AppSidebarProps) => {
  return (
    <Sidebar>
      <SidebarContent>
        <div className="p-6 border-b border-sidebar-border">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Cronos
          </h1>
          <p className="text-xs text-sidebar-foreground/70 mt-1">
            Enterprise Task Manager
          </p>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Views</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => onViewChange("board")}
                  isActive={activeView === "board"}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Task Board</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => onViewChange("timeline")}
                  isActive={activeView === "timeline"}
                >
                  <CalendarClock className="h-4 w-4" />
                  <span>Timeline</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => onViewChange("videos")}
                  isActive={activeView === "videos"}
                >
                  <Video className="h-4 w-4" />
                  <span>Video Scheduler</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => onViewChange("history")}
                  isActive={activeView === "history"}
                >
                  <History className="h-4 w-4" />
                  <span>Task History</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={onCreateTask}
                  className="bg-gradient-to-r from-primary to-accent text-white hover:opacity-90"
                >
                  <Plus className="h-4 w-4" />
                  <span>New Task</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={onSignOut} className="text-destructive hover:bg-destructive/10">
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};