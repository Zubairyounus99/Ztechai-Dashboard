import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface AddTodoFormProps {
  addTodo: (text: string, dueDate?: Date) => void;
  isAdding: boolean;
}

const AddTodoForm = ({ addTodo, isAdding }: AddTodoFormProps) => {
  const [text, setText] = useState("");
  const [date, setDate] = useState<Date | undefined>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isAdding) return;
    addTodo(text, date);
    setText("");
    setDate(undefined);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2 mb-4">
      <Input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a new task for your agency..."
        className="flex-grow"
        disabled={isAdding}
      />
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full flex-grow justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
              disabled={isAdding}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a due date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Button type="submit" size="icon" disabled={isAdding}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};

export default AddTodoForm;