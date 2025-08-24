export type Todo = {
  id: string;
  user_id?: string | null;
  text: string;
  completed: boolean;
  created_at: string;
  due_date?: string | null;
};