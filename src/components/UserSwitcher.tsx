"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { Role } from "@/types";

export function UserSwitcher() {
  const { user, setUser } = useAuth();

  const handleRoleChange = (role: Role) => {
    setUser({ ...user, role });
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-muted-foreground">
        Viewing as:
      </span>
      <Select onValueChange={handleRoleChange} value={user.role}>
        <SelectTrigger id="user-role" className="w-auto">
          <SelectValue placeholder="Select a role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Admin">Admin</SelectItem>
          <SelectItem value="Employee">Employee</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}