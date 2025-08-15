"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Client, STATUSES, PROJECT_STATUSES, Role, Status, ProjectStatus } from "@/types"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export type ColumnMeta = {
  handleEdit: (client: Client) => void;
  handleDelete: (clientId: string) => void;
  handleStatusUpdate: (clientId: string, newStatus: Status | ProjectStatus, type: 'status' | 'projectStatus') => void;
  currentUserRole: Role;
};

export const getColumns = (): ColumnDef<Client>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <div className="space-y-2">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 font-semibold hover:bg-transparent"
          >
            Client Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
          <Input
            placeholder="Filter..."
            value={(column.getFilterValue() as string) ?? ""}
            onChange={(event) => column.setFilterValue(event.target.value)}
            onClick={(e) => e.stopPropagation()}
            className="h-8"
          />
        </div>
      )
    },
    cell: ({ row }) => {
        const client = row.original;
        return (
            <div className="flex flex-col">
                <span className="font-medium">{client.name}</span>
                <span className="text-sm text-muted-foreground">{client.email}</span>
            </div>
        )
    }
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <div className="space-y-2">
          <span className="font-semibold">Status</span>
          <Select
            value={(column.getFilterValue() as string) ?? "all"}
            onValueChange={(value) => column.setFilterValue(value === "all" ? undefined : value)}
          >
            <SelectTrigger className="h-8 w-full">
              <SelectValue placeholder="Filter..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )
    },
    cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return <Badge variant={status === "Client" ? "default" : "secondary"}>{status}</Badge>
    }
  },
  {
    accessorKey: "projectStatus",
    header: ({ column }) => {
      return (
        <div className="space-y-2">
          <span className="font-semibold">Project Status</span>
          <Select
            value={(column.getFilterValue() as string) ?? "all"}
            onValueChange={(value) => column.setFilterValue(value === "all" ? undefined : value)}
          >
            <SelectTrigger className="h-8 w-full">
              <SelectValue placeholder="Filter..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {PROJECT_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )
    },
    cell: ({ row }) => {
        const projectStatus = row.getValue("projectStatus") as string;
        return <Badge variant="outline">{projectStatus}</Badge>
    }
  },
  {
    id: "pendingAmount",
    header: "Pending Amount",
    accessorFn: (row) => (row.designCharges || 0) - (row.amountPaid || 0),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("pendingAmount"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
 
      return <div className={cn("font-medium", amount > 0 && "text-orange-600")}>{formatted}</div>
    },
  },
  {
    accessorKey: "monthlySubscription",
    header: "Subscription",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("monthlySubscription"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
 
      return <div>{formatted}/mo</div>
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row, table }) => {
      const client = row.original
      const meta = table.options.meta as ColumnMeta;
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            
            {meta.currentUserRole === 'Admin' && (
              <>
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(client.email)}>
                  Copy Email
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => meta.handleEdit(client)}>Edit Client</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600" onClick={() => meta.handleDelete(client.id)}>Delete Client</DropdownMenuItem>
              </>
            )}

            {meta.currentUserRole === 'Employee' && (
              <>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Update Status</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      {STATUSES.map(status => (
                        <DropdownMenuItem key={status} onClick={() => meta.handleStatusUpdate(client.id, status, 'status')}>
                          {status}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Update Project Status</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      {PROJECT_STATUSES.map(status => (
                        <DropdownMenuItem key={status} onClick={() => meta.handleStatusUpdate(client.id, status, 'projectStatus')}>
                          {status}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </>
            )}

          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]