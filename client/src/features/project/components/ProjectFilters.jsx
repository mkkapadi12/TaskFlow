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
  { value: 'ALL', label: 'All Projects' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
];

const STATUS_COLORS = {
  ACTIVE: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  INACTIVE: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
};

const ProjectFilters = ({
  status,
  searchQuery,
  onStatusChange,
  onSearchChange,
}) => {
  const isFiltered = status !== 'ALL' || searchQuery.trim() !== '';

  const handleClear = () => {
    onStatusChange('ALL');
    onSearchChange('');
  };

  return (
    <div className="mb-6 space-y-3">
      {/* Filter Bar */}
      <div className="bg-card/50 border-border/50 flex flex-col gap-3 rounded-xl border p-3 backdrop-blur-sm sm:flex-row sm:items-center">
        {/* Search Input */}
        <div className="relative flex-1">
          <DASHBOARD_ICONS.SEARCH className="text-muted-foreground/60 pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            id="project-search"
            type="text"
            placeholder="Search by project name or description…"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-background/50 border-border/40 focus-visible:ring-primary/30 pl-9 text-sm transition-all focus-visible:ring-1"
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

        {/* Divider */}
        <div className="bg-border/50 hidden h-6 w-px sm:block" />

        {/* Status Dropdown */}
        <div className="flex items-center gap-2">
          <DASHBOARD_ICONS.FILTER className="text-muted-foreground h-4 w-4 shrink-0" />
          <Select value={status} onValueChange={onStatusChange}>
            <SelectTrigger
              id="project-status-filter"
              className="bg-background/50 border-border/40 focus:ring-primary/30 w-[160px] text-sm transition-all focus:ring-1"
            >
              <SelectValue placeholder="All Projects" />
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
                        className={`inline-block h-2 w-2 rounded-full border ${
                          opt.value === 'ACTIVE' ? 'bg-emerald-500 border-emerald-500/20' : 'bg-gray-500 border-gray-500/20'
                        }`}
                      />
                    )}
                    {opt.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Clear Button */}
        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="text-muted-foreground hover:text-foreground h-8 gap-1.5 px-2 text-xs"
          >
            <DASHBOARD_ICONS.CLOSE className="h-3 w-3" />
            Clear
          </Button>
        )}
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
        </div>
      )}
    </div>
  );
};

export default ProjectFilters;
