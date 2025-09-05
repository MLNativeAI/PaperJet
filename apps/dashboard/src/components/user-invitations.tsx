import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { useUserInvitations } from "@/hooks/use-user-invitations";
import { authClient } from "@/lib/auth-client";
import { renderTimestamp } from "@/lib/utils/date";

export default function UserInvitations() {
  const queryClient = useQueryClient();
  const { invitations, isLoading } = useUserInvitations();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    type: "accept" | "reject";
    invitationId: string;
    orgName: string;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAcceptInvitation = (invitationId: string, orgName: string) => {
    setPendingAction({ type: "accept", invitationId, orgName });
    setIsConfirmOpen(true);
  };

  const handleRejectInvitation = (invitationId: string, orgName: string) => {
    setPendingAction({ type: "reject", invitationId, orgName });
    setIsConfirmOpen(true);
  };

  const confirmAction = async () => {
    if (!pendingAction) return;

    setIsProcessing(true);
    try {
      if (pendingAction.type === "accept") {
        const { error } = await authClient.organization.acceptInvitation({
          invitationId: pendingAction.invitationId,
        });

        if (error) {
          toast.error("Failed to accept invitation");
          console.error(error);
        } else {
          toast.success(`You have joined ${pendingAction.orgName}`);
          queryClient.invalidateQueries({ queryKey: ["user-invitations"] });
          queryClient.invalidateQueries({ queryKey: ["list-organizations"] });
        }
      } else {
        const { error } = await authClient.organization.rejectInvitation({
          invitationId: pendingAction.invitationId,
        });

        if (error) {
          toast.error("Failed to reject invitation");
          console.error(error);
        } else {
          toast.success(`You have rejected the invitation to ${pendingAction.orgName}`);
          queryClient.invalidateQueries({ queryKey: ["user-invitations"] });
        }
      }
      setIsConfirmOpen(false);
    } catch (err) {
      toast.error(`Failed to ${pendingAction.type} invitation`);
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold">My invitations</h2>
        <p className="text-muted-foreground">Manage who has access to your organization</p>
      </div>
      <div className="flex flex-col gap-4">
        {invitations.map((invitation) => (
          <div key={invitation.id} className="flex justify-between">
            <div className="text-md">
              <div className="font">
                You are invited to the <span className="font-semibold">{invitation.organizationName}</span> Organization
              </div>
              <div className="text-sm text-muted-foreground">
                This invitation expires in {renderTimestamp(new Date(invitation.expiresAt))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleRejectInvitation(invitation.id, invitation.organizationName)}
              >
                Reject
              </Button>
              <Button onClick={() => handleAcceptInvitation(invitation.id, invitation.organizationName)}>Accept</Button>
            </div>
          </div>
        ))}
      </div>
      <ConfirmDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title={pendingAction?.type === "accept" ? "Accept Invitation" : "Reject Invitation"}
        description={
          pendingAction?.type === "accept"
            ? `Are you sure you want to accept the invitation to join ${pendingAction?.orgName}?`
            : `Are you sure you want to reject the invitation to join ${pendingAction?.orgName}?`
        }
        confirmText={pendingAction?.type === "accept" ? "Accept" : "Reject"}
        onConfirm={confirmAction}
        isLoading={isProcessing}
      />
    </div>
  );
}
