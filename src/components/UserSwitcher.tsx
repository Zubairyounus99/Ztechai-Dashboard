import { useAuth } from "@/context/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Role } from "@/types";

export const UserSwitcher = () => {
  const { user, setUser } = useAuth();

  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="user-role" className="text-sm font-medium">Viewing as:</Label>
      <Select
        value={user.role}
        onValueChange={(value: Role) => setUser(value)}
      >
        <SelectTrigger id="user-role" className="w-[180px]">
          <SelectValue placeholder="Select a role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Admin">Admin</SelectItem>
          <SelectItem value="Employee">Employee</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};