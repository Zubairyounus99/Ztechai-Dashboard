import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import { isToday, isPast } from "date-fns";
import { Todo } from "@/types";

interface AiSummaryProps {
  todos: Todo[];
}

const AiSummary = ({ todos }: AiSummaryProps) => {
  const pendingTodos = todos.filter((todo) => !todo.completed);
  const highPriorityCount = pendingTodos.filter(
    (todo) => todo.priority === "High"
  ).length;
  const overdueCount = pendingTodos.filter(
    (todo) =>
      todo.dueDate &&
      isPast(new Date(todo.dueDate)) &&
      !isToday(new Date(todo.dueDate))
  ).length;

  let summary = "No tasks for today yet. Time to plan your day!";
  const pendingCount = pendingTodos.length;

  if (todos.length > 0) {
    if (pendingCount > 0) {
      summary = `You have ${pendingCount} pending tasks.`;
      if (highPriorityCount > 0) {
        summary += ` ${highPriorityCount} ${
          highPriorityCount > 1 ? "are" : "is"
        } high priority.`;
      }
      if (overdueCount > 0) {
        summary += ` Watch out for ${overdueCount} overdue ${
          overdueCount > 1 ? "tasks" : "task"
        }!`;
      }
      const nextHighPriority = pendingTodos.find(t => t.priority === 'High');
      if (nextHighPriority) {
        summary += ` Your top priority is: "${nextHighPriority.text}".`
      }
    } else {
      summary = "Great job! All tasks are completed.";
    }
  }

  return (
    <Card className="mb-8 bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
        <Lightbulb className="h-6 w-6 text-blue-500" />
        <CardTitle className="text-lg font-semibold text-blue-900 dark:text-blue-200">AI Daily Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-blue-800 dark:text-blue-300">{summary}</p>
      </CardContent>
    </Card>
  );
};

export default AiSummary;