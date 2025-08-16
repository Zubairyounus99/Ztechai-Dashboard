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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Priority, PRIORITIES } from "@/types";

interface AddTodoFormProps {
  addTodo: (
    text: string,
    dueDate?: Date,
    priority?: Priority,
    category?: string
  ) => void;
}

const AddTodoForm = ({ addTodo }: AddTodoFormProps) => {
  const [text, setText] = useState("");
  const [date, setDate] = useState<Date | undefined>();
  const [priority, setPriority] = useState<Priority>("Medium");
  const [category, setCategory] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    addTodo(text, date, priority, category.trim());
    setText("");
    setDate(undefined);
    setPriority("Medium");
    setCategory("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mb-4">
      <Input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a new task for your agency..."
        className="flex-grow"
      />
      <div className="flex flex-col md:flex-row gap-2">
        <Input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category (e.g., Client Work)"
          className="flex-grow"
        />
        <div className="flex gap-2 w-full">
          <Select onValueChange={(v: Priority) => setPriority(v)} value={priority}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              {PRIORITIES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Due date</span>}
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
        </div>
      </div>
      <Button type="submit" className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Task
      </Button>
    </form>
  );
};

export default AddTodoForm;