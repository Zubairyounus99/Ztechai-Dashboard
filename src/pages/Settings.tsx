import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, Trash2 } from "lucide-react";
import { STATUSES, PROJECT_STATUSES, SERVICES } from "@/types";
import { EmployeeManager } from "@/components/EmployeeManager";

const DynamicFieldManager = ({ title, description, options }: { title: string, description: string, options: readonly string[] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {options.map(option => (
            <div key={option} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
              <span className="text-sm font-medium">{option}</span>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Trash2 className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          ))}
        </div>
        <Separator className="my-4" />
        <div className="flex items-center gap-2">
          <Input placeholder="Add new option..." />
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const Settings = () => {
  const { user } = useAuth();

  if (user?.role !== "Admin") {
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
      <main className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <EmployeeManager />
        <DynamicFieldManager 
          title="Client Statuses"
          description="Options for the client status dropdown."
          options={STATUSES}
        />
        <DynamicFieldManager 
          title="Project Statuses"
          description="Options for the project status dropdown."
          options={PROJECT_STATUSES}
        />
        <DynamicFieldManager 
          title="Services"
          description="Options for the services offered."
          options={SERVICES}
        />
      </main>
    </div>
  );
};

export default Settings;