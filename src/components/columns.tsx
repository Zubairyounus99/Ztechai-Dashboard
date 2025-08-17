"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Client, Status, ProjectStatus } from "@/types"
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
import { Checkbox } from "@/components/ui/checkbox"

export const getColumns = (): ColumnDef<Client>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
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
  },
  {
    accessorKey: "status",
    header: "Client Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as Status
      return <Badge>{status}</Badge>
    },
  },
  {
    accessorKey: "projectStatus",
    header: "Project Status",
    cell: ({ row }) => {
      const projectStatus = row.getValue("projectStatus") as ProjectStatus
      return <Badge variant="outline">{projectStatus}</Badge>
    },
  },
  {
    accessorKey: "monthlySubscription",
    header: () => <div className="text-right">Subscription</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("monthlySubscription"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)

      return <div className="text-right font-medium">{formatted}/mo</div>
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const client = row.original
      const meta = table.options.meta as any;

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
            <DropdownMenuItem onClick={() => meta.handleViewDetails(client)}>
              View Details
            </DropdownMenuItem>
            {meta.currentUserRole === 'Admin' && (
              <>
                <DropdownMenuItem onClick={() => meta.handleEdit(client)}>
                  Edit Client
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => meta.handleDelete(client.id)}
                >
                  Delete Client
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]