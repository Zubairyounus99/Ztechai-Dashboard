import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Pencil, Trash, Save } from "lucide-react";

type Todo = {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
};

interface TodoItemProps {
  todo: Todo;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  editTodo: (id: number, text: string) => void;
}

const TodoItem = ({ todo, toggleTodo, deleteTodo, editTodo }: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleSave = () => {
    if (!editText.trim()) return;
    editTodo(todo.id, editText);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-4 p-2 border-b">
      <Checkbox
        id={`todo-${todo.id}`}
        checked={todo.completed}
        onCheckedChange={() => toggleTodo(todo.id)}
      />
      <div className="flex-grow">
        {isEditing ? (
          <Input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            className="h-8"
          />
        ) : (
          <label
            htmlFor={`todo-${todo.id}`}
            className={`text-sm cursor-pointer ${todo.completed ? "line-through text-muted-foreground" : ""}`}
          >
            {todo.text}
          </label>
        )}
      </div>
      <div className="flex gap-1">
        {isEditing ? (
          <Button variant="ghost" size="icon" onClick={handleSave}>
            <Save className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
            <Pencil className="h-4 w-4" />
          </Button>
        )}
        <Button variant="ghost" size="icon" onClick={() => deleteTodo(todo.id)}>
          <Trash className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    </div>
  );
};

export default TodoItem;