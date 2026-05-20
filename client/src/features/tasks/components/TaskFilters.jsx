import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const TaskFilters = ({ status, onStatusChange }) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
      <div className="flex items-center gap-2">
        <Label htmlFor="status-filter" className="text-sm font-medium">
          Status:
        </Label>
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger
            id="status-filter"
            className="w-[150px] bg-background/50 border-border/50"
          >
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent
            position="popper"
            className="bg-card/95 backdrop-blur-sm border-border/50"
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
