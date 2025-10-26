import { useMemo } from "react";
import { type Task } from "@/types/tasks";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Building2 } from "lucide-react";

interface TimelineProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export const Timeline = ({ tasks, onTaskClick }: TimelineProps) => {
  const sortedTasks = useMemo(() => {
    return [...tasks]
      .filter((task) => task.date)
      .sort((a, b) => {
        const dateA = new Date(a.date + (a.time ? ` ${a.time}` : ""));
        const dateB = new Date(b.date + (b.time ? ` ${b.time}` : ""));
        return dateA.getTime() - dateB.getTime();
      });
  }, [tasks]);

  const groupedByDate = useMemo(() => {
    const groups: Record<string, Task[]> = {};
    sortedTasks.forEach((task) => {
      if (task.date) {
        if (!groups[task.date]) {
          groups[task.date] = [];
        }
        groups[task.date].push(task);
      }
    });
    return groups;
  }, [sortedTasks]);

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "done":
        return "bg-green-500";
      case "in-progress":
        return "bg-blue-500";
      default:
        return "bg-gray-400";
    }
  };

  if (sortedTasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">
          No scheduled tasks. Add dates to your tasks to see them here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {Object.entries(groupedByDate).map(([date, dateTasks]) => (
        <div key={date} className="relative">
          <div className="sticky top-0 z-10 bg-background py-2 mb-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">
                {new Date(date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h3>
            </div>
          </div>

          <div className="relative pl-8 space-y-4">
            <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-border" />

            {dateTasks.map((task) => (
              <div key={task.id} className="relative">
                <div
                  className={`absolute left-0 top-3 w-[7px] h-[7px] rounded-full ${getStatusColor(
                    task.status
                  )} ring-4 ring-background`}
                />

                <Card
                  onClick={() => onTaskClick(task)}
                  className="ml-6 p-4 cursor-pointer hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start gap-3">
                        {task.time && (
                          <div className="flex items-center gap-1 text-sm font-medium text-primary">
                            <Clock className="h-4 w-4" />
                            {task.time}
                          </div>
                        )}
                        <h4 className="font-semibold text-foreground flex-1">
                          {task.title}
                        </h4>
                      </div>

                      {task.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        {task.author && (
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{task.author}</span>
                          </div>
                        )}
                        {task.organization && (
                          <div className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            <span>{task.organization}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <Badge
                      variant={
                        task.status === "done"
                          ? "default"
                          : task.status === "in-progress"
                          ? "secondary"
                          : "outline"
                      }
                      className="shrink-0"
                    >
                      {task.status === "done"
                        ? "Done"
                        : task.status === "in-progress"
                        ? "In Progress"
                        : "To Do"}
                    </Badge>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
