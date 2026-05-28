import { Badge } from '@/components/ui/badge';
import { priorityConfig } from '@/constant';

const PriorityBadge = ({ priority, className = '', size = 'md' }) => {
  const config = priorityConfig[priority];
  if (!config) return null;

  const sizeClasses = {
    sm: 'text-[9px] px-1.5 py-0',
    md: 'text-[10px] px-2.5 py-0.5',
    lg: 'text-xs px-3 py-1',
  };

  return (
    <Badge
      variant="outline"
      className={`rounded-full border font-semibold ${config.className} ${sizeClasses[size] || sizeClasses.md} ${className}`}
    >
      {config.label}
    </Badge>
  );
};

export default PriorityBadge;
