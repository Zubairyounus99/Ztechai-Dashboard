import { useState, useEffect, useMemo } from "react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Client } from "@/types";
import { mockClients } from "@/data/mock";
import { getColumns } from "@/components/columns";
import { ClientDataTable } from "@/components/ClientDataTable";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ClientForm } from "@/components/ClientForm";
import { formatISO } from "date-fns";

const Index = () => {
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

  const handleFormSubmit = (data: Client) => {
    if (editingClient) {
      // Update existing client
      setClients(clients.map((c) => c.id === data.id ? {...data, lastContact: formatISO(new Date())} : c));
    } else {
      // Add new client
      setClients([{ ...data, lastContact: formatISO(new Date()) }, ...clients]);
    }
    setIsDialogOpen(false);
    setEditingClient(undefined);
  };

  const columns = useMemo(() => getColumns({ handleEdit, handleDelete }), [clients]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-8">
      <div className="container mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight">ZTechAI Client Management</h1>
          <p className="text-xl text-muted-foreground mt-2">
            Your central hub for managing client relationships and projects.
          </p>
        </header>
        <main>
          <div className="flex justify-end mb-4">
            <Button onClick={handleAddNew}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Client
            </Button>
          </div>
          <ClientDataTable columns={columns} data={clients} />
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
};

export default Index;