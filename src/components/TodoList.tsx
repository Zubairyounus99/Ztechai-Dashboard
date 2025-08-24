import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Todo } from "@/types";
import { showError, showSuccess } from "@/utils/toast";
import { isToday, isPast, parseISO } from "date-fns";

import AddTodoForm from "./AddTodoForm";
import TodoItem from "./TodoItem";
import TodoControls from "./TodoControls";
import AiSummary from "./AiSummary";
import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentSession } from "@/utils/auth";

type FilterValue = "all" | "today" | "overdue";
type SortValue = "due_date" | "created_at";

const TodoList = () => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<FilterValue>("all");
  const [sortBy, setSortBy] = useState<SortValue>("created_at");

  const { data: todos = [], isLoading, isError } = useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: async () => {
      const session = await getCurrentSession();
      if (!session) {
        throw new Error("Not authenticated");
      }

      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }
      return data || [];
    },
  });

  const filteredAndSortedTodos = useMemo(() => {
    let filtered = [...todos];

    if (filter === "today") {
      filtered = filtered.filter(todo => todo.due_date && isToday(parseISO(todo.due_date)));
    } else if (filter === "overdue") {
      filtered = filtered.filter(todo => todo.due_date && isPast(parseISO(todo.due_date)) && !isToday(parseISO(todo.due_date)));
    }

    if (sortBy === "due_date") {
      filtered.sort((a, b) => {
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      });
    } else { // created_at
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return filtered;
  }, [todos, filter, sortBy]);

  const mutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: (error: Error) => {
      showError(error.message || "An error occurred.");
    },
  };

  const addTodoMutation = useMutation({
    mutationFn: async ({ text, dueDate }: { text: string; dueDate?: Date }) => {
      const session = await getCurrentSession();
      if (!session) throw new Error("Not authenticated");
      const { error } = await supabase.from("todos").insert([{ text, user_id: session.user.id, due_date: dueDate?.toISOString() }]);
      if (error) throw error;
    },
    ...mutationOptions,
    onSuccess: () => {
      mutationOptions.onSuccess();
      showSuccess("Task added successfully!");
    }
  });

  const toggleTodoMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      const { error } = await supabase.from("todos").update({ completed }).eq("id", id);
      if (error) throw error;
    },
    ...mutationOptions,
  });

  const deleteTodoMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("todos").delete().eq("id", id);
      if (error) throw error;
    },
    ...mutationOptions,
    onSuccess: () => {
      mutationOptions.onSuccess();
      showSuccess("Task deleted.");
    }
  });

  const editTodoMutation = useMutation({
    mutationFn: async ({ id, text }: { id: string; text: string }) => {
      const { error } = await supabase.from("todos").update({ text }).eq("id", id);
      if (error) throw error;
    },
    ...mutationOptions,
  });

  if (isError) {
    return <div className="text-center text-red-500">Something went wrong. Please try refreshing the page.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <AiSummary todos={todos} />
      <AddTodoForm
        addTodo={(text, dueDate) => addTodoMutation.mutate({ text, dueDate })}
        isAdding={addTodoMutation.isPending}
      />
      <TodoControls
        filter={filter}
        setFilter={setFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        {isLoading ? (
          <div className="p-4 space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : filteredAndSortedTodos.length > 0 ? (
          filteredAndSortedTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              toggleTodo={(id, completed) => toggleTodoMutation.mutate({ id, completed })}
              deleteTodo={(id) => deleteTodoMutation.mutate(id)}
              editTodo={(id, text) => editTodoMutation.mutate({ id, text })}
            />
          ))
        ) : (
          <p className="p-4 text-center text-muted-foreground">No tasks found. Add one to get started!</p>
        )}
      </div>
    </div>
  );
};

export default TodoList;