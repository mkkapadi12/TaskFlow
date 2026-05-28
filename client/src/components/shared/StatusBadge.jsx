import { Badge } from '@/components/ui/badge';
import { statusConfig } from '@/constant';

const StatusBadge = ({ status, className = '', size = 'md' }) => {
  const config = statusConfig[status] ?? statusConfig.TODO;

  const sizeClasses = {
    sm: 'text-[9px] px-1.5 py-0',
    md: 'text-[11px] px-2.5 py-0.5',
    lg: 'text-xs px-3 py-1',
  };

  return (
    <Badge
      variant="outline"
      className={`rounded-full border font-semibold ${config.className} ${sizeClasses[size] || sizeClasses.md} ${className}`}
    >
      <span
        className={`mr-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${config.dot}`}
      />
      {config.label}
    </Badge>
  );
};

export default StatusBadge;
