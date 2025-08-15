import { useState, useEffect, useMemo } from "react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Client, ProjectStatus, Status } from "@/types";
import { mockClients } from "@/data/mock";
import { getColumns } from "@/components/columns";
import { ClientDataTable } from "@/components/ClientDataTable";
import { Button } from "@/components/ui/button";
import { PlusCircle, Settings } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ClientForm } from "@/components/ClientForm";
import { formatISO } from "date-fns";
import { DashboardStats } from "@/components/DashboardStats";
import { useAuth } from "@/context/AuthContext";
import { UserSwitcher } from "@/components/UserSwitcher";
import { Link } from "react-router-dom";

const Index = () => {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>(() => {
    try {
      const localClients = window.localStorage.getItem("clients");
      return localClients ? JSON.parse(localClients) : mockClients;
    } catch (error) {
      console.error("Failed to parse clients from localStorage", error);
      return mockClients;
    }
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | undefined>(undefined);

  useEffect(() => {
    window.localStorage.setItem("clients", JSON.stringify(clients));
  }, [clients]);

  const handleAddNew = () => {
    setEditingClient(undefined);
    setIsDialogOpen(true);
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setIsDialogOpen(true);
  };

  const handleDelete = (clientId: string) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      setClients(clients.filter((c) => c.id !== clientId));
    }
  };

  const handleStatusUpdate = (clientId: string, newStatus: Status | ProjectStatus, type: 'status' | 'projectStatus') => {
    setClients(clients.map(c => 
      c.id === clientId ? { ...c, [type]: newStatus, lastContact: formatISO(new Date()) } : c
    ));
  };

  const handleFormSubmit = (data: Client) => {
    if (editingClient) {
      setClients(clients.map((c) => c.id === data.id ? {...data, lastContact: formatISO(new Date())} : c));
    } else {
      setClients([{ ...data, lastContact: formatISO(new Date()) }, ...clients]);
    }
    setIsDialogOpen(false);
    setEditingClient(undefined);
  };

  const columns = useMemo(() => getColumns(), []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-8">
      <div className="container mx-auto">
        <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-4xl font-bold tracking-tight">ZTechAI Client Management</h1>
            <p className="text-xl text-muted-foreground mt-2">
              Your central hub for managing client relationships and projects.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <UserSwitcher />
            {user.role === 'Admin' && (
              <Link to="/settings">
                <Button variant="outline" size="icon" aria-label="Application Settings">
                  <Settings className="h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>
        </header>
        <main>
          <DashboardStats clients={clients} />
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Client List</h2>
            {user.role === 'Admin' && (
              <Button onClick={handleAddNew}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Client
              </Button>
            )}
          </div>
          <ClientDataTable 
            columns={columns} 
            data={clients} 
            meta={{
              handleEdit,
              handleDelete,
              handleStatusUpdate,
              currentUserRole: user.role,
            }}
          />
        </main>
        <MadeWithDyad />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] md:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingClient ? "Edit Client" : "Add New Client"}</DialogTitle>
            <DialogDescription>
              {editingClient ? "Update the client's details below." : "Fill in the new client's details."}
            </DialogDescription>
          </DialogHeader>
          <ClientForm 
            client={editingClient} 
            onSubmit={handleFormSubmit} 
            onCancel={() => setIsDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Index;