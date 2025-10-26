import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { TaskBoard } from "@/components/TaskBoard";
import { Timeline } from "@/components/Timeline";
import { TaskDialog } from "@/components/TaskDialog";
import { VideoScheduler } from "@/components/VideoScheduler";
import { TaskHistory } from "@/components/TaskHistory";
import { LandingPage } from "@/components/LandingPage";
import { ThemeToggle } from "@/components/ThemeToggle";
import {type Task } from "@/types/tasks";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {

  const { user, loading, signOut } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeView, setActiveView] = useState<"board" | "timeline" | "videos" | "history">("board");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false })

      .throwOnError()

   

    if (!error && data) {
      setTasks(
        data.map((task) => ({
          id: task.id,
          title: task.title,
          description: task.description || undefined,
          status: task.status as "todo" | "in-progress" | "done",
          date: task.due_date || undefined,
          time: task.due_time || undefined,
          author: task.author || undefined,
          organization: task.organization || undefined,
        }))
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  const handleCreateTask = () => {
    setSelectedTask(undefined);
    setDialogOpen(true);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setDialogOpen(true);
  };

  const handleSaveTask = async (taskData: Partial<Task>) => {
    if (taskData.id) {
      // Update existing task
      const { error } = await supabase
        .from("tasks")
        .update({
          title: taskData.title,
          description: taskData.description,
          status: taskData.status,
          due_date: taskData.date,
          due_time: taskData.time,
          author: taskData.author,
          organization: taskData.organization,
        })
        .eq("id", taskData.id);

      if (!error) {
        await logTaskHistory(taskData.id, "updated", null, taskData);
        fetchTasks();
        toast.success("Task updated successfully");
      } else {
        toast.error("Failed to update task");
      }
    } else {
      // Create new task
      const { data, error } = await supabase
        .from("tasks")
        .insert({
          title: taskData.title || "",
          description: taskData.description,
          status: taskData.status || "todo",
          due_date: taskData.date,
          due_time: taskData.time,
          author: taskData.author,
          organization: taskData.organization,
          user_id: user.id,
        })
        .select()
        .single();

      if (!error && data) {
        await logTaskHistory(data.id, "created", null, data);
        fetchTasks();
        toast.success("Task created successfully");
      } else {
        toast.error("Failed to create task");
      }
    }
  };

  const logTaskHistory = async (
    taskId: string,
    action: string,
    oldValue: any,
    newValue: any
  ) => {
    await supabase.from("task_history").insert({
      task_id: taskId,
      user_id: user.id,
      action,
      old_value: oldValue,
      new_value: newValue,
    });
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar
          activeView={activeView}
          onViewChange={setActiveView}
          onCreateTask={handleCreateTask}
          onSignOut={handleSignOut}
        />

        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-card/50 backdrop-blur-sm">
            <div className="flex items-center">
              <SidebarTrigger />
              <div className="ml-4">
                <h2 className="text-2xl font-bold text-foreground">
                  {activeView === "board"
                    ? "Task Board"
                    : activeView === "timeline"
                    ? "Timeline View"
                    : activeView === "videos"
                    ? "Video Scheduler"
                    : "Task History"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {activeView === "board"
                    ? "Drag tasks between columns to update their status"
                    : activeView === "timeline"
                    ? "View your tasks in chronological order"
                    : activeView === "videos"
                    ? "Manage your YouTube playlists"
                    : "Track all changes to your tasks"}
                </p>
              </div>
            </div>
            <ThemeToggle />
          </header>

          <main className="flex-1 overflow-auto">
            {activeView === "board" ? (
              <div className="p-6">
                <TaskBoard
                  tasks={tasks}
                  onTasksChange={async (newTasks) => {
                    setTasks(newTasks);

                    // Find tasks whose status actually changed
                    const prevById = new Map(tasks.map((t) => [t.id, t]));
                    const changed = newTasks.filter(
                      (t) => prevById.get(t.id)?.status !== t.status
                    );
                    if (changed.length === 0) return;

                    await Promise.all(
                      changed.map(async (t) => {
                        const oldStatus = prevById.get(t.id)?.status;
                        await supabase
                          .from("tasks")
                          .update({ status: t.status })
                          .eq("id", t.id);
                        await logTaskHistory(
                          t.id,
                          "status_changed",
                          { status: oldStatus },
                          { status: t.status }
                        );
                      })
                    );
                  }}
                  onTaskClick={handleTaskClick}
                />
              </div>
            ) : activeView === "timeline" ? (
              <div className="p-6">
                <Timeline tasks={tasks} onTaskClick={handleTaskClick} />
              </div>
            ) : activeView === "videos" ? (
              <VideoScheduler />
            ) : (
              <TaskHistory />
            )}
          </main>
        </div>

        <TaskDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          task={selectedTask}
          onSave={handleSaveTask}
        />
      </div>
    </SidebarProvider>
  );
};

export default Index;