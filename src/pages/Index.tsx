import { MadeWithDyad } from "@/components/made-with-dyad";
import TodoList from "@/components/TodoList";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-8">
      <div className="container mx-auto">
        <header className="text-center mb-8 relative">
          <h1 className="text-4xl font-bold tracking-tight">AI Agency Task Manager</h1>
          <p className="text-xl text-muted-foreground mt-2">
            Organize your day, track progress, and stay ahead.
          </p>
          <Button 
            onClick={handleSignOut} 
            variant="outline" 
            className="absolute top-0 right-0"
          >
            Sign Out
          </Button>
        </header>
        <main>
          <TodoList />
        </main>
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Index;