import React, { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetAllUsersQuery } from "@/features/users/user.api";
import { DASHBOARD_ICONS } from "@/lib/icons/dashboard.icons";
import { cn } from "@/lib/utils";

const ROLE_OPTIONS = ["MEMBER", "ADMIN"];

const AddMemberDialog = ({
  open,
  onOpenChange,
  existingMemberIds = [],
  onAdd,
  isSaving,
}) => {
  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [role, setRole] = useState("MEMBER");

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
          : true,
      );
  }, [usersRes, existingMemberIds, search]);

  const handleClose = (next) => {
    if (!next) {
      setSearch("");
      setSelectedUserId(null);
      setRole("MEMBER");
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
      <DialogContent className="sm:max-w-[520px] border-border/50 bg-card/95 backdrop-blur-sm">
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
              <DASHBOARD_ICONS.SEARCH className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="user-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email..."
                className="pl-9 border-border/50 bg-background/50"
              />
            </div>
          </div>

          <div className="rounded-lg border border-border/50 bg-background/30">
            <ScrollArea className="h-[240px]">
              <div className="p-2 space-y-1">
                {isLoading ? (
                  <div className="text-center py-8 text-sm text-muted-foreground">
                    Loading users...
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="text-center py-8 text-sm text-muted-foreground">
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
                          "w-full flex items-center gap-3 rounded-md p-2 text-left transition-colors",
                          isActive
                            ? "bg-primary/10 border border-primary/30"
                            : "hover:bg-muted/60 border border-transparent",
                        )}
                      >
                        <Avatar size="sm">
                          {user.avatar && <AvatarImage src={user.avatar} />}
                          <AvatarFallback>
                            {user.name?.charAt(0).toUpperCase() || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">
                            {user.name}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {user.email}
                          </div>
                        </div>
                        {isActive && (
                          <DASHBOARD_ICONS.CHECKCIRCLE className="h-4 w-4 text-primary shrink-0" />
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
                className="w-full border-border/50 bg-background/50"
              >
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent
                position="popper"
                className="bg-card/95 backdrop-blur-sm border-border/50"
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
              {isSaving ? "Adding..." : "Add Member"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberDialog;
