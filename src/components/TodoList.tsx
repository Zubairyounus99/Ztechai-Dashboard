import { useState, useEffect, useMemo } from "react";
import AddTodoForm from "./AddTodoForm";
import TodoItem from "./TodoItem";
import AiSummary from "./AiSummary";
import TodoControls from "./TodoControls";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Todo } from "@/types";
import { isToday, startOfDay } from "date-fns";

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

  const [filter, setFilter] = useState<'all' | 'today' | 'overdue'>('all');
  const [sortBy, setSortBy] = useState<'createdAt' | 'dueDate'>('createdAt');

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

  const processedTodos = useMemo(() => {
    const todayStart = startOfDay(new Date());

    return todos
      .filter(todo => {
        if (filter === 'all') return true;
        if (filter === 'today') {
          return todo.dueDate && isToday(new Date(todo.dueDate));
        }
        if (filter === 'overdue') {
          return todo.dueDate && new Date(todo.dueDate) < todayStart && !todo.completed;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'createdAt') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'dueDate') {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        return 0;
      });
  }, [todos, filter, sortBy]);

  const pendingTodos = processedTodos.filter(todo => !todo.completed);
  const completedTodos = processedTodos.filter(todo => todo.completed);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AiSummary todos={todos} />
      <Card>
        <CardHeader>
          <CardTitle>My Agency Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <AddTodoForm addTodo={addTodo} />
          <TodoControls filter={filter} setFilter={setFilter} sortBy={sortBy} setSortBy={setSortBy} />
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