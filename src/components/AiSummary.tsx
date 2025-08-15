import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

type Todo = {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
};

interface AiSummaryProps {
  todos: Todo[];
}

const AiSummary = ({ todos }: AiSummaryProps) => {
  const today = new Date();
  const todaysTodos = todos.filter(
    (todo) => new Date(todo.createdAt).toDateString() === today.toDateString()
  );

  const completedCount = todaysTodos.filter((todo) => todo.completed).length;
  const pendingCount = todaysTodos.length - completedCount;

  let summary = "No tasks for today yet. Time to plan your day!";

  if (todaysTodos.length > 0) {
    summary = `Today's focus: You have ${pendingCount} pending and ${completedCount} completed tasks.`;
    if (pendingCount > 0) {
      const nextTask = todaysTodos.find((todo) => !todo.completed);
      if (nextTask) {
        summary += ` Your next priority could be: "${nextTask.text}".`;
      }
    } else {
      summary += " Great job clearing your tasks for the day!";
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