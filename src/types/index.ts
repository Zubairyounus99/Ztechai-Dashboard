export type Todo = {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
  dueDate?: Date;
};