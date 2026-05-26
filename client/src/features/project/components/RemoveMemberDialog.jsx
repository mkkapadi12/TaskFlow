import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const RemoveMemberDialog = ({
  member,
  isOpen,
  onOpenChange,
  reason,
  onReasonChange,
  onConfirm,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-border/50 bg-card/95 backdrop-blur-sm sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Remove member?</AlertDialogTitle>
          <AlertDialogDescription>
            {member
              ? `${member.userName} will lose access to this project. They'll receive an email notification.`
              : ''}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-2">
          <Label htmlFor="remove-reason" className="text-sm">
            Reason{' '}
            <span className="text-muted-foreground">(shared in the email)</span>
          </Label>
          <Textarea
            id="remove-reason"
            value={reason}
            onChange={(e) => onReasonChange(e.target.value)}
            placeholder="Why are you removing this member?"
            className="border-border/50 bg-background/50 min-h-22"
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RemoveMemberDialog;
