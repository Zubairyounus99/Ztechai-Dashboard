import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Pencil, Trash, Save } from "lucide-react";
import { Todo } from "@/types";
import { format, isPast, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface TodoItemProps {
  todo: Todo;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  editTodo: (id: number, text: string) => void;
}

const priorityVariantMap = {
  High: "destructive",
  Medium: "secondary",
  Low: "outline",
} as const;

const TodoItem = ({ todo, toggleTodo, deleteTodo, editTodo }: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleSave = () => {
    if (!editText.trim()) return;
    editTodo(todo.id, editText);
    setIsEditing(false);
  };

  const dueDateText = todo.dueDate ? format(new Date(todo.dueDate), "PP") : null;
  const isOverdue = todo.dueDate && isPast(new Date(todo.dueDate)) && !isToday(new Date(todo.dueDate)) && !todo.completed;
  const isDueToday = todo.dueDate && isToday(new Date(todo.dueDate)) && !todo.completed;

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
          <div className="flex flex-col items-start">
            <label
              htmlFor={`todo-${todo.id}`}
              className={`text-sm cursor-pointer ${todo.completed ? "line-through text-muted-foreground" : ""}`}
            >
              {todo.text}
            </label>
            <div className="flex items-center gap-2 mt-1">
              {dueDateText && (
                <span className={cn("text-xs font-semibold", 
                  isOverdue ? "text-red-500" : 
                  isDueToday ? "text-blue-500" : 
                  "text-muted-foreground"
                )}>
                  {dueDateText}
                </span>
              )}
              {todo.category && <Badge variant="secondary">{todo.category}</Badge>}
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center gap-1">
        <Badge variant={priorityVariantMap[todo.priority]}>{todo.priority}</Badge>
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