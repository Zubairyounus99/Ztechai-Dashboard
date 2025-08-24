// Add this import at the top
import { getCurrentSession } from '@/utils/auth';

// Update the addTodoMutation to use the new utility
const addTodoMutation = useMutation({
  mutationFn: async ({ text, dueDate }: { text: string, dueDate?: Date }) => {
    const session = await getCurrentSession();
    if (!session) throw new Error('Not authenticated');

    const newTodo = {
      text,
      user_id: session.user.id,
      due_date: dueDate ? dueDate.toISOString() : undefined,
    };

    const { error } = await supabase.from('todos').insert([newTodo]);
    if (error) throw error;
  },
  // ... rest of the mutation
});