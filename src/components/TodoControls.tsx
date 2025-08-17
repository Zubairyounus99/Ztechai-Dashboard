import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type FilterValue = "all" | "today" | "overdue";
type SortValue = "due_date" | "created_at";

interface TodoControlsProps {
  filter: FilterValue;
  setFilter: (filter: FilterValue) => void;
  sortBy: SortValue;
  setSortBy: (sortBy: SortValue) => void;
}

const TodoControls = ({ filter, setFilter, sortBy, setSortBy }: TodoControlsProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 my-4">
      <ToggleGroup 
        type="single" 
        value={filter} 
        onValueChange={(value: FilterValue) => { if (value) setFilter(value); }}
        aria-label="Filter tasks"
      >
        <ToggleGroupItem value="all" aria-label="All tasks">All</ToggleGroupItem>
        <ToggleGroupItem value="today" aria-label="Tasks due today">Today</ToggleGroupItem>
        <ToggleGroupItem value="overdue" aria-label="Overdue tasks">Overdue</ToggleGroupItem>
      </ToggleGroup>
      <Select value={sortBy} onValueChange={(value: SortValue) => setSortBy(value)}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="due_date">Due Date</SelectItem>
          <SelectItem value="created_at">Creation Date</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TodoControls;