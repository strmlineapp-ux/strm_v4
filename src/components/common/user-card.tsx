import { StrmUser } from '../../context/user-context';
import { Card, CardHeader } from '../ui/card';

interface UserCardProps {
  user: StrmUser;
  className?: string;
}

export function UserCard({ user, className }: UserCardProps) {
  return (
    <Card className={`group bg-transparent border border-border/50 shadow-none ${className ?? ''}`}>
      <CardHeader className="p-3 flex-row items-center gap-3">
        <div className="relative shrink-0">
          <div className="h-9 w-9 rounded-full overflow-hidden bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.displayName} className="w-full h-full object-cover" />
            ) : (
              user.displayName.slice(0, 2).toUpperCase()
            )}
          </div>
          <span
            className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-background ${user.googleCalendarLinked ? 'bg-green-500' : 'bg-muted-foreground/40'}`}
          />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium leading-none truncate">{user.displayName}</p>
          <p className="text-xs text-muted-foreground truncate mt-0.5">{user.title || 'No title'}</p>
        </div>
      </CardHeader>
    </Card>
  );
}
