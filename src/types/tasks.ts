export type TaskStatus = "todo" | "in-progress" | "done";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  date?: string;
  time?: string;
  author?: string;
  organization?: string;
}
