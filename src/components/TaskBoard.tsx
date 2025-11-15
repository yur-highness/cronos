import { useState } from "react";
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

import { TaskColumn } from "./Taskcolumn";
import { type Task, type TaskStatus } from "@/types/tasks";
import { Card } from "@/components/ui/card";

interface TaskBoardProps {
  tasks: Task[];
  onTasksChange: (tasks: Task[]) => void;
  onTaskClick: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
}

export const TaskBoard = ({ tasks, onTasksChange, onTaskClick, onTaskDelete }: TaskBoardProps) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    const overId = over.id as string;

    if (!activeTask) return;

    // Check if dropped on a column
    const statuses: TaskStatus[] = ["todo", "in-progress", "done"];
    const newStatus = statuses.find((s) => s === overId);

    if (newStatus && activeTask.status !== newStatus) {
      const updatedTasks = tasks.map((task) =>
        task.id === activeTask.id ? { ...task, status: newStatus } : task
      );
      onTasksChange(updatedTasks);
      return;
    }

    // Handle reordering within same column
    if (active.id !== over.id) {
      const oldIndex = tasks.findIndex((t) => t.id === active.id);
      const newIndex = tasks.findIndex((t) => t.id === over.id);
      onTasksChange(arrayMove(tasks, oldIndex, newIndex));
    }
  };

  const getTasksByStatus = (status: TaskStatus) =>
    tasks.filter((task) => task.status === status);

  const activeTask = activeId ? tasks.find((t) => t.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
        <TaskColumn
          title="To Do"
          status="todo"
          tasks={getTasksByStatus("todo")}
          onTaskClick={onTaskClick}
          onTaskDelete={onTaskDelete}
        />
        <TaskColumn
          title="In Progress"
          status="in-progress"
          tasks={getTasksByStatus("in-progress")}
          onTaskClick={onTaskClick}
          onTaskDelete={onTaskDelete}
        />
        <TaskColumn
          title="Done"
          status="done"
          tasks={getTasksByStatus("done")}
          onTaskClick={onTaskClick}
          onTaskDelete={onTaskDelete}
        />
      </div>

      <DragOverlay>
        {activeTask ? (
          <Card className="p-4 shadow-lg rotate-3">
            <h3 className="font-semibold">{activeTask.title}</h3>
          </Card>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
