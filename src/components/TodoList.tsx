import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AddTodoForm from "./AddTodoForm";
import TodoItem from "./TodoItem";
import AiSummary from "./AiSummary";
import TodoControls from "./TodoControls";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Todo } from "@/types";
import { isToday, startOfDay, parseISO } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { showError, showSuccess } from "@/utils/toast";

const getTodos = async (): Promise<Todo[]> => {
  const { data, error } = await supabase
    .from('todos')
    .select('*');

  if (error) {
    showError("Failed to fetch tasks.");
    throw new Error(error.message);
  }
  return data || [];
};

const TodoList = () => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'all' | 'today' | 'overdue'>('all');
  const [sortBy, setSortBy] = useState<'created_at' | 'due_date'>('created_at');

  const { data: todos = [], isLoading } = useQuery<Todo[]>({
    queryKey: ['todos'],
    queryFn: getTodos,
  });

  const addTodoMutation = useMutation({
    mutationFn: async ({ text, dueDate }: { text: string, dueDate?: Date }) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const newTodo = {
        text,
        user_id: session.user.id,
        due_date: dueDate ? dueDate.toISOString() : undefined,
      };

      const { error } = await supabase.from('todos').insert([newTodo]);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      showSuccess("Task added!");
    },
    onError: () => {
      showError("Failed to add task.");
    },
  });

  const updateTodoMutation = useMutation({
    mutationFn: async (updatedTodo: Partial<Todo> & { id: string }) => {
      const { error } = await supabase.from('todos').update(updatedTodo).eq('id', updatedTodo.id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
    onError: () => {
      showError("Failed to update task.");
    },
  });

  const deleteTodoMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('todos').delete().eq('id', id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      showSuccess("Task deleted.");
    },
    onError: () => {
      showError("Failed to delete task.");
    },
  });

  const addTodo = (text: string, dueDate?: Date) => {
    addTodoMutation.mutate({ text, dueDate });
  };

  const toggleTodo = (id: string, completed: boolean) => {
    updateTodoMutation.mutate({ id, completed });
  };

  const editTodo = (id: string, text: string) => {
    updateTodoMutation.mutate({ id, text });
  };

  const deleteTodo = (id: string) => {
    deleteTodoMutation.mutate(id);
  };

  const processedTodos = useMemo(() => {
    const todayStart = startOfDay(new Date());

    return todos
      .filter(todo => {
        if (filter === 'all') return true;
        const dueDate = todo.due_date ? parseISO(todo.due_date) : null;
        if (!dueDate) return false;

        if (filter === 'today') {
          return isToday(dueDate);
        }
        if (filter === 'overdue') {
          return dueDate < todayStart && !todo.completed;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'created_at') {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        if (sortBy === 'due_date') {
          if (!a.due_date) return 1;
          if (!b.due_date) return -1;
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        }
        return 0;
      });
  }, [todos, filter, sortBy]);

  const pendingTodos = processedTodos.filter(todo => !todo.completed);
  const completedTodos = processedTodos.filter(todo => todo.completed);

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AiSummary todos={todos} />
      <Card>
        <CardHeader>
          <CardTitle>My Agency Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <AddTodoForm addTodo={addTodo} isAdding={addTodoMutation.isPending} />
          <TodoControls filter={filter} setFilter={setFilter} sortBy={sortBy as any} setSortBy={setSortBy as any} />
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Pending</h3>
            {pendingTodos.length > 0 ? (
              pendingTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  toggleTodo={toggleTodo}
                  deleteTodo={deleteTodo}
                  editTodo={editTodo}
                />
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No pending tasks match your filters.</p>
            )}
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Completed</h3>
            {completedTodos.length > 0 ? (
              completedTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  toggleTodo={toggleTodo}
                  deleteTodo={deleteTodo}
                  editTodo={editTodo}
                />
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No completed tasks match your filters.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TodoList;