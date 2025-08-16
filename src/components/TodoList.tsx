import { useState, useEffect, useMemo } from "react";
import AddTodoForm from "./AddTodoForm";
import TodoItem from "./TodoItem";
import AiSummary from "./AiSummary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Todo, Priority } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SortBy = "createdAt" | "dueDate" | "priority";

const priorityOrder: Record<Priority, number> = {
  High: 3,
  Medium: 2,
  Low: 1,
};

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      const localTodos = window.localStorage.getItem("todos");
      return localTodos ? JSON.parse(localTodos).map((t: any) => ({
        ...t, 
        createdAt: new Date(t.createdAt),
        dueDate: t.dueDate ? new Date(t.dueDate) : undefined,
      })) : [
        { id: 1, text: "Follow up with Client X", completed: false, createdAt: new Date(), dueDate: new Date(new Date().setDate(new Date().getDate() + 2)), priority: "High", category: "Client Relations" },
        { id: 2, text: "Review new AI model performance", completed: true, createdAt: new Date(), priority: "Medium", category: "Internal" },
        { id: 3, text: "Schedule team sync for Project Y", completed: false, createdAt: new Date(), dueDate: new Date(), priority: "High", category: "Project Management" },
      ];
    } catch (error) {
      console.error("Failed to parse todos from localStorage", error);
      return [];
    }
  });
  const [sortBy, setSortBy] = useState<SortBy>("createdAt");

  useEffect(() => {
    window.localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text: string, dueDate?: Date, priority: Priority = "Medium", category?: string) => {
    const newTodo: Todo = {
      id: Date.now(),
      text,
      completed: false,
      createdAt: new Date(),
      dueDate,
      priority,
      category,
    };
    setTodos([newTodo, ...todos]);
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const editTodo = (id: number, text: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text } : todo
      )
    );
  };

  const sortedTodos = useMemo(() => {
    return [...todos].sort((a, b) => {
      if (sortBy === "priority") {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      if (sortBy === "dueDate") {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      // Default to createdAt
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [todos, sortBy]);

  const pendingTodos = sortedTodos.filter(todo => !todo.completed);
  const completedTodos = sortedTodos.filter(todo => todo.completed);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AiSummary todos={todos} />
      <Card>
        <CardHeader>
          <CardTitle>My Agency Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <AddTodoForm addTodo={addTodo} />
          <div className="flex justify-end items-center mb-2">
            <label htmlFor="sort" className="text-sm font-medium mr-2">Sort by:</label>
            <Select onValueChange={(v: SortBy) => setSortBy(v)} value={sortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Newest</SelectItem>
                <SelectItem value="dueDate">Due Date</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
              <p className="text-sm text-muted-foreground">No pending tasks. Well done!</p>
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
              <p className="text-sm text-muted-foreground">No tasks completed yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TodoList;