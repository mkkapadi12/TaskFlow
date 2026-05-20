
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const TaskFilters = ({ status, onStatusChange }) => {
  return (
    <div className="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
      <div className="flex items-center gap-2">
        <Label htmlFor="status-filter" className="text-sm font-medium">
          Status:
        </Label>
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger
            id="status-filter"
            className="bg-background/50 border-border/50 w-[150px]"
          >
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent
            position="popper"
            className="bg-card/95 border-border/50 backdrop-blur-sm"
          >
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="TODO">To Do</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="IN_REVIEW">In Review</SelectItem>
            <SelectItem value="DONE">Done</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TaskFilters;
