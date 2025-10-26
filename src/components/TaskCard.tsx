import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Building2, GripVertical } from "lucide-react";
import { type Task } from "@/types/tasks";

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

export const TaskCard = ({ task, onClick }: TaskCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      onClick={onClick}
      className={`p-4 cursor-pointer hover:shadow-md transition-all duration-200 ${
        isDragging ? "opacity-50 shadow-lg" : "shadow-sm"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing mt-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <GripVertical className="h-5 w-5" />
        </div>
        
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="font-semibold text-foreground leading-tight mb-1">
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {task.description}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {task.date && (
              <Badge variant="secondary" className="text-xs font-normal">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(task.date).toLocaleDateString()}
              </Badge>
            )}
            {task.time && (
              <Badge variant="secondary" className="text-xs font-normal">
                <Clock className="h-3 w-3 mr-1" />
                {task.time}
              </Badge>
            )}
          </div>

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
      </div>
    </Card>
  );
};