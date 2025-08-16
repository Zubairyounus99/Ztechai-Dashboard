export const PRIORITIES = ["Low", "Medium", "High"] as const;
export type Priority = typeof PRIORITIES[number];

export type Todo = {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
  dueDate?: Date;
  priority: Priority;
  category?: string;
};