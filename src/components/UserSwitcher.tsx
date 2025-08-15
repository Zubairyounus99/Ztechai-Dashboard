import { useAuth } from "@/context/AuthContext";
import { useEmployees } from "@/context/EmployeeContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { User } from "@/types";

const adminUser: User = { id: '1', name: 'Admin User', role: 'Admin' };

export const UserSwitcher = () => {
  const { user, setUser } = useAuth();
  const { employees } = useEmployees();

  const allUsers = [adminUser, ...employees];

  const handleValueChange = (userId: string) => {
    const selectedUser = allUsers.find(u => u.id === userId);
    if (selectedUser) {
      setUser(selectedUser);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="user-role" className="text-sm font-medium">Viewing as:</Label>
      <Select
        value={user.id}
        onValueChange={handleValueChange}
      >
        <SelectTrigger id="user-role" className="w-[180px]">
          <SelectValue placeholder="Select a user" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={adminUser.id}>Admin</SelectItem>
          {employees.map(employee => (
            <SelectItem key={employee.id} value={employee.id}>
              {employee.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};