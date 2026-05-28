import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const StatsCard = ({
  title,
  value,
  description,
  icon,
  variant = 'dashboard', // 'dashboard' or 'minimal'
  accentColor = 'sky', // 'sky', 'violet', 'emerald', 'amber', 'destructive', etc.
  className = '',
}) => {
  const accentClasses = {
    sky: 'border-l-sky-500 bg-sky-500/10 text-sky-600 dark:text-sky-400',
    violet: 'border-l-violet-500 bg-violet-500/10 text-violet-600 dark:text-violet-400',
    emerald: 'border-l-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    amber: 'border-l-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400',
    destructive: 'border-l-destructive bg-destructive/10 text-destructive',
    primary: 'border-l-primary bg-primary/10 text-primary',
  };

  const selectedAccent = accentClasses[accentColor] || accentClasses.sky;

  if (variant === 'minimal') {
    return (
      <Card className={cn('border-border/50 bg-card/50 backdrop-blur-sm transition-all', className)}>
        <CardContent className="flex flex-col items-center gap-2 p-3 text-center sm:flex-row sm:gap-4 sm:p-5 sm:text-left">
          <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full sm:h-11 sm:w-11', selectedAccent)}>
            {icon}
          </div>
          <div className="w-full min-w-0">
            <div className="text-muted-foreground truncate text-[10px] tracking-wider uppercase sm:text-xs">
              {title}
            </div>
            <div className="text-foreground text-lg font-bold sm:text-2xl mt-0.5">
              {value}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Dashboard variant: vertical layout with border highlight
  return (
    <Card className={cn(
      'border-border/50 bg-card/50 hover:bg-card/85 p-0 shadow-sm backdrop-blur-sm transition-all border-l-4',
      selectedAccent.split(' ')[0], // Extracts just the border-l class
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-1 sm:p-6 sm:pb-2">
        <CardTitle className="text-muted-foreground sm:text-foreground text-[11px] font-semibold tracking-tight sm:text-sm sm:font-medium">
          {title}
        </CardTitle>
        <div className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-full sm:h-8 sm:w-8', selectedAccent.split(' ').slice(1).join(' '))}>
          {icon}
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
        <div className="text-foreground text-lg font-bold sm:text-2xl">
          {value}
        </div>
        {description && (
          <p className="text-muted-foreground mt-1 hidden text-xs sm:block">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
