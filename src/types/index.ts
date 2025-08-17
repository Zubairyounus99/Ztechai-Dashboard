export type Todo = {
  id: string;
  user_id: string;
  text: string;
  completed: boolean;
  created_at: string;
  due_date?: string | null;
};