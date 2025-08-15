import { useState } from "react";
import { useEmployees } from "@/context/EmployeeContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Trash2, UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "./ui/label";

export const EmployeeManager = () => {
  const { employees, addEmployee, deleteEmployee } = useEmployees();
  const [newEmployeeName, setNewEmployeeName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddEmployee = () => {
    if (newEmployeeName.trim()) {
      addEmployee(newEmployeeName.trim());
      setNewEmployeeName("");
      setIsDialogOpen(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Employee Management</CardTitle>
        <CardDescription>Add, view, or remove employees from the system.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {employees.map(employee => (
            <div key={employee.id} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
              <span className="text-sm font-medium">{employee.name}</span>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteEmployee(employee.id)}>
                <Trash2 className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          ))}
           {employees.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No employees found.</p>
          )}
        </div>
        <Separator className="my-4" />
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">
              <UserPlus className="h-4 w-4 mr-2" />
              Add New Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
              <DialogDescription>
                Enter the name of the new employee to add them to the system.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newEmployeeName}
                  onChange={(e) => setNewEmployeeName(e.target.value)}
                  className="col-span-3"
                  placeholder="e.g., John Doe"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddEmployee}>Save Employee</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};