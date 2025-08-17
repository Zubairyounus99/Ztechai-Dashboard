import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Pencil, Trash, Save } from "lucide-react";
import { Todo } from "@/types";
import { format, isPast, isToday, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

interface TodoItemProps {
  todo: Todo;
  toggleTodo: (id: string, completed: boolean) => void;
  deleteTodo: (id: string) => void;
  editTodo: (id: string, text: string) => void;
}

const TodoItem = ({ todo, toggleTodo, deleteTodo, editTodo }: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleSave = () => {
    if (!editText.trim()) return;
    editTodo(todo.id, editText);
    setIsEditing(false);
  };

  const dueDate = todo.due_date ? parseISO(todo.due_date) : null;
  const dueDateText = dueDate ? format(dueDate, "PP") : null;
  const isOverdue = dueDate && isPast(dueDate) && !isToday(dueDate) && !todo.completed;
  const isDueToday = dueDate && isToday(dueDate) && !todo.completed;

  return (
    <div className="flex items-center gap-4 p-2 border-b">
      <Checkbox
        id={`todo-${todo.id}`}
        checked={todo.completed}
        onCheckedChange={(checked) => toggleTodo(todo.id, !!checked)}
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
            {dueDateText && (
              <span className={cn("text-xs font-semibold", 
                isOverdue ? "text-red-500" : 
                isDueToday ? "text-blue-500" : 
                "text-muted-foreground"
              )}>
                {dueDateText}
              </span>
            )}
          </div>
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