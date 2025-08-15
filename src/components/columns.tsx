"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Client } from "@/types"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type ColumnMeta = {
  handleEdit: (client: Client) => void;
  handleDelete: (clientId: string) => void;
};

export const getColumns = (meta: ColumnMeta): ColumnDef<Client>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Client Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
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
    header: "Status",
    cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return <Badge variant={status === "Client" ? "default" : "secondary"}>{status}</Badge>
    }
  },
  {
    accessorKey: "projectStatus",
    header: "Project Status",
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
    cell: ({ row }) => {
      const client = row.original
 
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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(client.email)}>
              Copy Email
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => meta.handleEdit(client)}>Edit Client</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600" onClick={() => meta.handleDelete(client.id)}>Delete Client</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]