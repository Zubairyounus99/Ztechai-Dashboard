import { useState, useEffect } from "react";
import AddTodoForm from "./AddTodoForm";
import TodoItem from "./TodoItem";
import AiSummary from "./AiSummary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Todo } from "@/types";

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      const localTodos = window.localStorage.getItem("todos");
      return localTodos ? JSON.parse(localTodos).map((t: any) => ({
        ...t, 
        createdAt: new Date(t.createdAt),
        dueDate: t.dueDate ? new Date(t.dueDate) : undefined,
      })) : [
        { id: 1, text: "Follow up with Client X", completed: false, createdAt: new Date(), dueDate: new Date(new Date().setDate(new Date().getDate() + 2)) },
        { id: 2, text: "Review new AI model performance", completed: true, createdAt: new Date() },
        { id: 3, text: "Schedule team sync for Project Y", completed: false, createdAt: new Date(), dueDate: new Date() },
      ];
    } catch (error) {
      console.error("Failed to parse todos from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    window.localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text: string, dueDate?: Date) => {
    const newTodo: Todo = {
      id: Date.now(),
      text,
      completed: false,
      createdAt: new Date(),
      dueDate,
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

  const pendingTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AiSummary todos={todos} />
      <Card>
        <CardHeader>
          <CardTitle>My Agency Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <AddTodoForm addTodo={addTodo} />
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