import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DASHBOARD_ICONS } from '@/lib/icons/dashboard.icons';

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'TODO', label: 'To Do' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'IN_REVIEW', label: 'In Review' },
  { value: 'DONE', label: 'Done' },
];

const STATUS_COLORS = {
  TODO: 'bg-sky-500/10 text-sky-500 border-sky-500/20',
  IN_PROGRESS: 'bg-violet-500/10 text-violet-500 border-violet-500/20',
  IN_REVIEW: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  DONE: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
};

const PRIORITY_OPTIONS = [
  { value: 'ALL', label: 'All Priorities' },
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
  { value: 'URGENT', label: 'Urgent' },
];

const PRIORITY_COLORS = {
  LOW: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
  MEDIUM: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  HIGH: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  URGENT: 'bg-red-500/10 text-red-500 border-red-500/20',
};

const TaskFilters = ({
  status,
  searchQuery,
  onStatusChange,
  onSearchChange,
  priority,
  onPriorityChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
}) => {
  const isFiltered =
    status !== 'ALL' ||
    searchQuery.trim() !== '' ||
    priority !== 'ALL' ||
    (startDate && startDate.trim() !== '') ||
    (endDate && endDate.trim() !== '');

  const handleClear = () => {
    onStatusChange('ALL');
    onSearchChange('');
    onPriorityChange('ALL');
    onStartDateChange('');
    onEndDateChange('');
  };

  return (
    <div className="mb-6 space-y-3">
      {/* Filter Bar */}
      <div className="bg-card/50 border-border/50 flex flex-col gap-4 rounded-xl border p-4 backdrop-blur-sm lg:flex-row lg:items-center lg:gap-3 lg:p-3">
        {/* Search */}
        <div className="relative w-full lg:flex-1">
          <DASHBOARD_ICONS.SEARCH className="text-muted-foreground/60 pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            id="task-search"
            type="text"
            placeholder="Search by task name or project title.."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-background/50 border-border/40 focus-visible:ring-primary/30 h-10 w-full pl-9 text-sm transition-all focus-visible:ring-1 lg:h-9"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
              aria-label="Clear search"
            >
              <DASHBOARD_ICONS.CLOSE className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Divider for desktop */}
        <div className="bg-border/50 hidden h-6 w-px lg:block" />

        {/* Filters Grid for mobile/tablet, Flex for desktop */}
        <div className="grid w-full grid-cols-2 gap-3 lg:flex lg:w-auto lg:items-center lg:gap-3">
          {/* Status Select */}
          <div className="col-span-1 flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-2">
            <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase lg:hidden">
              Status
            </span>
            <div className="flex w-full items-center gap-2">
              <DASHBOARD_ICONS.FILTER className="text-muted-foreground hidden h-4 w-4 shrink-0 lg:block" />
              <Select value={status} onValueChange={onStatusChange}>
                <SelectTrigger
                  id="status-filter"
                  className="bg-background/50 border-border/40 focus:ring-primary/30 h-10 w-full text-sm transition-all focus:ring-1 lg:h-9 lg:w-37.5"
                >
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  className="bg-card/95 border-border/50 backdrop-blur-sm"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <div className="flex items-center gap-2">
                        {opt.value !== 'ALL' && (
                          <span
                            className={`inline-block h-2 w-2 rounded-full border ${STATUS_COLORS[opt.value]}`}
                          />
                        )}
                        {opt.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Priority Select */}
          <div className="col-span-1 flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-2">
            <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase lg:hidden">
              Priority
            </span>
            <div className="flex w-full items-center gap-2">
              <span className="text-muted-foreground hidden shrink-0 text-xs font-semibold lg:inline">
                Priority:
              </span>
              <Select value={priority} onValueChange={onPriorityChange}>
                <SelectTrigger
                  id="priority-filter"
                  className="bg-background/50 border-border/40 focus:ring-primary/30 h-10 w-full text-sm transition-all focus:ring-1 lg:h-9 lg:w-35"
                >
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  className="bg-card/95 border-border/50 backdrop-blur-sm"
                >
                  {PRIORITY_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <div className="flex items-center gap-2">
                        {opt.value !== 'ALL' && (
                          <span
                            className={`inline-block h-2 w-2 rounded-full border ${PRIORITY_COLORS[opt.value]}`}
                          />
                        )}
                        {opt.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Deadline Date Range */}
          <div className="col-span-2 flex flex-col gap-1 lg:col-span-1 lg:flex-row lg:items-center lg:gap-2">
            <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase lg:hidden">
              Deadline Range
            </span>
            <div className="flex w-full items-center gap-2">
              <DASHBOARD_ICONS.CALENDAR className="text-muted-foreground hidden h-4 w-4 shrink-0 lg:block" />
              <div className="flex w-full items-center gap-2">
                <Input
                  id="task-start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => onStartDateChange(e.target.value)}
                  className="bg-background/50 border-border/40 focus-visible:ring-primary/30 h-10 w-full px-2 text-xs transition-all focus-visible:ring-1 lg:h-9 lg:w-32.5"
                />
                <span className="text-muted-foreground shrink-0 px-0.5 text-xs">
                  to
                </span>
                <Input
                  id="task-end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => onEndDateChange(e.target.value)}
                  className="bg-background/50 border-border/40 focus-visible:ring-primary/30 h-10 w-full px-2 text-xs transition-all focus-visible:ring-1 lg:h-9 lg:w-32.5"
                />
              </div>
            </div>
          </div>

          {/* Clear button */}
          {isFiltered && (
            <div className="col-span-2 mt-1 flex justify-end lg:col-span-1 lg:mt-0 lg:w-auto">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="text-muted-foreground hover:text-foreground border-border/50 h-10 w-full justify-center gap-1.5 border border-dashed px-3 text-xs lg:h-8 lg:w-auto lg:border-none lg:px-2"
              >
                <DASHBOARD_ICONS.CLOSE className="h-3.5 w-3.5 lg:h-3 lg:w-3" />
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Active filter chips */}
      {isFiltered && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-muted-foreground text-xs">Active filters:</span>
          {searchQuery.trim() && (
            <Badge
              variant="outline"
              className="border-primary/30 text-primary bg-primary/5 gap-1.5 text-xs"
            >
              <DASHBOARD_ICONS.SEARCH className="h-2.5 w-2.5" />"{searchQuery}"
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="hover:text-foreground ml-0.5 transition-colors"
                aria-label="Remove search filter"
              >
                <DASHBOARD_ICONS.CLOSE className="h-2.5 w-2.5" />
              </button>
            </Badge>
          )}
          {status !== 'ALL' && (
            <Badge
              variant="outline"
              className={`gap-1.5 border text-xs ${STATUS_COLORS[status] ?? ''}`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {STATUS_OPTIONS.find((o) => o.value === status)?.label}
              <button
                type="button"
                onClick={() => onStatusChange('ALL')}
                className="hover:text-foreground ml-0.5 transition-colors"
                aria-label="Remove status filter"
              >
                <DASHBOARD_ICONS.CLOSE className="h-2.5 w-2.5" />
              </button>
            </Badge>
          )}
          {priority !== 'ALL' && (
            <Badge
              variant="outline"
              className={`gap-1.5 border text-xs ${PRIORITY_COLORS[priority] ?? ''}`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {PRIORITY_OPTIONS.find((o) => o.value === priority)?.label}
              <button
                type="button"
                onClick={() => onPriorityChange('ALL')}
                className="hover:text-foreground ml-0.5 transition-colors"
                aria-label="Remove priority filter"
              >
                <DASHBOARD_ICONS.CLOSE className="h-2.5 w-2.5" />
              </button>
            </Badge>
          )}
          {startDate && (
            <Badge
              variant="outline"
              className="border-primary/30 text-primary bg-primary/5 gap-1.5 text-xs"
            >
              From: {startDate}
              <button
                type="button"
                onClick={() => onStartDateChange('')}
                className="hover:text-foreground ml-0.5 transition-colors"
                aria-label="Remove start date filter"
              >
                <DASHBOARD_ICONS.CLOSE className="h-2.5 w-2.5" />
              </button>
            </Badge>
          )}
          {endDate && (
            <Badge
              variant="outline"
              className="border-primary/30 text-primary bg-primary/5 gap-1.5 text-xs"
            >
              To: {endDate}
              <button
                type="button"
                onClick={() => onEndDateChange('')}
                className="hover:text-foreground ml-0.5 transition-colors"
                aria-label="Remove end date filter"
              >
                <DASHBOARD_ICONS.CLOSE className="h-2.5 w-2.5" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskFilters;
