import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Settings = () => {
  const { user } = useAuth();

  if (user.role !== "Admin") {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground mb-8">
          You must be an administrator to view this page.
        </p>
        <Link to="/">
          <Button>Return to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
        <p className="text-xl text-muted-foreground mt-2">
          Manage application-wide settings and configurations.
        </p>
      </header>
      <main>
        <Card>
          <CardHeader>
            <CardTitle>Dynamic Fields</CardTitle>
            <CardDescription>
              Manage the options available in dropdown menus across the application.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This feature is coming soon! You will be able to add, edit, and delete options for fields like "Client Status" and "Project Status" right here.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Settings;