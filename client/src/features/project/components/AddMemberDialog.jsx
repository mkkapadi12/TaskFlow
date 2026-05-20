import { useMemo, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGetAllUsersQuery } from '@/features/users/user.api';
import { DASHBOARD_ICONS } from '@/lib/icons/dashboard.icons';
import { cn } from '@/lib/utils';

const ROLE_OPTIONS = ['MEMBER', 'ADMIN'];

const AddMemberDialog = ({
  open,
  onOpenChange,
  existingMemberIds = [],
  onAdd,
  isSaving,
}) => {
  const [search, setSearch] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [role, setRole] = useState('MEMBER');

  const { data: usersRes, isLoading } = useGetAllUsersQuery(undefined, {
    skip: !open,
  });

  const filteredUsers = useMemo(() => {
    const users = usersRes?.users || [];
    const memberSet = new Set(existingMemberIds);
    const q = search.trim().toLowerCase();
    return users
      .filter((u) => !memberSet.has(u.id))
      .filter((u) =>
        q
          ? u.name?.toLowerCase().includes(q) ||
            u.email?.toLowerCase().includes(q)
          : true
      );
  }, [usersRes, existingMemberIds, search]);

  const handleClose = (next) => {
    if (!next) {
      setSearch('');
      setSelectedUserId(null);
      setRole('MEMBER');
    }
    onOpenChange(next);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedUserId) return;
    onAdd({ userId: selectedUserId, role });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="border-border/50 bg-card/95 backdrop-blur-sm sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Add Project Member</DialogTitle>
          <DialogDescription>
            Search for a user and assign them a role in this project.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="user-search">Search users</Label>
            <div className="relative">
              <DASHBOARD_ICONS.SEARCH className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                id="user-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email..."
                className="border-border/50 bg-background/50 pl-9"
              />
            </div>
          </div>

          <div className="border-border/50 bg-background/30 rounded-lg border">
            <ScrollArea className="h-[240px]">
              <div className="space-y-1 p-2">
                {isLoading ? (
                  <div className="text-muted-foreground py-8 text-center text-sm">
                    Loading users...
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="text-muted-foreground py-8 text-center text-sm">
                    No users available to add.
                  </div>
                ) : (
                  filteredUsers.map((user) => {
                    const isActive = selectedUserId === user.id;
                    return (
                      <button
                        type="button"
                        key={user.id}
                        onClick={() => setSelectedUserId(user.id)}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-md p-2 text-left transition-colors',
                          isActive
                            ? 'bg-primary/10 border-primary/30 border'
                            : 'hover:bg-muted/60 border border-transparent'
                        )}
                      >
                        <Avatar size="sm">
                          {user.avatar && <AvatarImage src={user.avatar} />}
                          <AvatarFallback>
                            {user.name?.charAt(0).toUpperCase() || '?'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium">
                            {user.name}
                          </div>
                          <div className="text-muted-foreground truncate text-xs">
                            {user.email}
                          </div>
                        </div>
                        {isActive && (
                          <DASHBOARD_ICONS.CHECKCIRCLE className="text-primary h-4 w-4 shrink-0" />
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </div>

          <div className="space-y-2">
            <Label htmlFor="member-role">Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger
                id="member-role"
                className="border-border/50 bg-background/50 w-full"
              >
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent
                position="popper"
                className="bg-card/95 border-border/50 backdrop-blur-sm"
              >
                {ROLE_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleClose(false)}
              className="border-border/50"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!selectedUserId || isSaving}>
              {isSaving ? 'Adding...' : 'Add Member'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberDialog;
