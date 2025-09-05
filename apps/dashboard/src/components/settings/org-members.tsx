import { IconDotsVertical, IconEdit, IconTrash } from "@tabler/icons-react";
import InviteDialog from "@/components/settings/invite-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { isOrgInvitation, isOrgMember, type OrgMemberInvitation, useOrgMembers } from "@/hooks/use-org-members";
import { formatRelative, subDays } from "date-fns";

function InviteOrJoinDate({ invOrMember: invOrMember }: { invOrMember: OrgMemberInvitation }) {
  if (isOrgMember(invOrMember)) {
    const relativeTime = formatRelative(invOrMember.createdAt, new Date());
    return <div className="text-xs text-muted-foreground">Joined {relativeTime}</div>;
  } else {
    const relativeTime = formatRelative(invOrMember.issuedAt, new Date());
    return <div className="text-xs text-muted-foreground">Invited {relativeTime}</div>;
  }
}

// function StatusLabel({ orgInvitation }: { orgInvitation: OrgInvitation }) {
//   let color = "text-green-600";
//
//   switch (orgInvitation.status) {
//     case "pending":
//       color = "text-yellow-600";
//       break;
//     case "accepted":
//       color = "text-green-600";
//       break;
//     case "rejected":
//       color = "text-red-600";
//       break;
//     case "canceled":
//       color = "text-gray-600";
//   }
//
//   return <div className={color}>{invOrMember.status}</div>;
// }
//
export default function OrgMembers() {
  const { orgMemberInvitations, isLoading } = useOrgMembers();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold">Team Members</h2>
          <p className="text-muted-foreground">Manage who has access to your organization</p>
        </div>
        <InviteDialog />
      </div>
      <div className="pt-4">
        <div className="">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="border rounded-md p-4">
              {orgMemberInvitations.map((invOrMember) => (
                <TableRow key={invOrMember.id}>
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      <div className="text-sm font-semibold">{invOrMember.email}</div>
                      <InviteOrJoinDate invOrMember={invOrMember} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{invOrMember.role}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <IconDotsVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {isOrgMember(invOrMember) && (
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
                        {isOrgInvitation(invOrMember) && (
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
