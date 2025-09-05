import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDotsVertical,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { formatRelative } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { isOrgInvitation, isOrgMember, type OrgMemberInvitation } from "@/hooks/use-org-members";

function InviteOrJoinDate({ invOrMember }: { invOrMember: OrgMemberInvitation }) {
  if (isOrgMember(invOrMember)) {
    const relativeTime = formatRelative(invOrMember.createdAt, new Date());
    return <div className="text-xs text-muted-foreground">Joined {relativeTime}</div>;
  } else {
    const relativeTime = formatRelative(invOrMember.issuedAt, new Date());
    return <div className="text-xs text-muted-foreground">Invited {relativeTime}</div>;
  }
}

export function OrgMembersTable({ data, isLoading }: { data: OrgMemberInvitation[]; isLoading: boolean }) {
  const columns: ColumnDef<OrgMemberInvitation>[] = [
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="flex flex-col gap-2">
          <div className="text-sm font-semibold">{row.original.email}</div>
          <InviteOrJoinDate invOrMember={row.original} />
        </div>
      ),
      enableHiding: false,
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => <div className="font-medium">{row.original.role}</div>,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                size="icon"
              >
                <IconDotsVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              {isOrgMember(row.original) && (
                <>
                  <DropdownMenuItem>
                    <IconEdit className="mr-2 h-4 w-4" />
                    Leave
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <IconEdit className="mr-2 h-4 w-4" />
                    Remove if admin
                  </DropdownMenuItem>
                </>
              )}
              {isOrgInvitation(row.original) && (
                <>
                  <DropdownMenuItem>
                    <IconTrash className="mr-2 h-4 w-4" />
                    Cancel
                  </DropdownMenuItem>
                  <DropdownMenuItem>Resend invitation</DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Show skeleton rows when loading
              <>
                <TableRow key="skeleton-1" className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      <div className="h-4 w-32 bg-muted rounded animate-pulse"></div>
                      <div className="h-3 w-24 bg-muted rounded animate-pulse"></div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-16 bg-muted rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="h-8 w-8 bg-muted rounded animate-pulse ml-auto"></div>
                  </TableCell>
                </TableRow>
                <TableRow key="skeleton-2" className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      <div className="h-4 w-32 bg-muted rounded animate-pulse"></div>
                      <div className="h-3 w-24 bg-muted rounded animate-pulse"></div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-16 bg-muted rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="h-8 w-8 bg-muted rounded animate-pulse ml-auto"></div>
                  </TableCell>
                </TableRow>
                <TableRow key="skeleton-3" className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      <div className="h-4 w-32 bg-muted rounded animate-pulse"></div>
                      <div className="h-3 w-24 bg-muted rounded animate-pulse"></div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-16 bg-muted rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="h-8 w-8 bg-muted rounded animate-pulse ml-auto"></div>
                  </TableCell>
                </TableRow>
              </>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="hover:bg-muted/50">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
