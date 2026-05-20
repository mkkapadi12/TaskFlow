import { useEffect, useState } from 'react';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const STATUS_OPTIONS = ['ACTIVE', 'INACTIVE'];

const EditProjectDialog = ({
  open,
  onOpenChange,
  project,
  onSave,
  isSaving,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('ACTIVE');

  useEffect(() => {
    if (project && open) {
      setTitle(project.title || '');
      setDescription(project.description || '');
      setStatus(project.status || 'ACTIVE');
    }
  }, [project, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ title, description, status });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border/50 bg-card/95 backdrop-blur-sm sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>
            Update the project information below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Project Title</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="border-border/50 bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border-border/50 bg-background/50 min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger
                id="edit-status"
                className="border-border/50 bg-background/50 w-full"
              >
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent
                position="popper"
                className="bg-card/95 border-border/50 backdrop-blur-sm"
              >
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-border/50"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim() || isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProjectDialog;
