import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/use-auth';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

export function UserMenu() {
  const { currentUser, logout, isAdmin, users, viewAsUser, setViewAsUserId, isImpersonating } = useAuth();
  const [open, setOpen] = useState(false);

  if (!currentUser) return null;

  // Use the active user profile (either true self or impersonated self) for the visual avatar
  const activeProfile = viewAsUser || currentUser;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button 
          className={`relative flex items-center justify-center rounded-full w-10 h-10 overflow-hidden ring-offset-background transition-all ${isImpersonating ? 'border-2 border-destructive' : ''}`}
          title={isImpersonating ? "View As Active" : "User Menu"}
        >
          {activeProfile.avatarUrl ? (
            <img src={activeProfile.avatarUrl} alt={activeProfile.displayName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
              {activeProfile.displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </button>
      </PopoverTrigger>
      
      <PopoverContent side="right" align="end" className="w-64 p-0 ml-4 mb-2">
        <div className="flex flex-col p-4 border-b border-border">
          <span className="font-medium text-sm truncate">{activeProfile.displayName}</span>
          <span className="text-xs text-muted-foreground truncate">{activeProfile.email}</span>
          {isImpersonating && (
             <span className="text-xs text-destructive font-medium mt-1 uppercase tracking-wider">Impersonation Mode</span>
          )}
        </div>

        <div className="flex flex-col p-2 space-y-1">
          <NavLink 
            to="/dashboard/settings" 
            className="flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors text-foreground"
            onClick={() => setOpen(false)}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>tune</span>
            Account Settings
          </NavLink>
          
          <NavLink 
            to="/dashboard/notifications" 
            className="flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors text-foreground"
            onClick={() => setOpen(false)}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>notifications</span>
            Notifications
            {/* Realistically, unread badge counter logic would go here */}
          </NavLink>
        </div>

        {isAdmin && (
          <div className="p-2 border-t border-border space-y-1">
            <span className="px-3 py-1 text-xs font-semibold uppercase text-muted-foreground tracking-wider">View As</span>
            
            <button
               onClick={() => {
                  setViewAsUserId(null);
                  setOpen(false);
               }}
               className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${!isImpersonating ? 'font-medium' : 'text-foreground'}`}
            >
               <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>account_circle</span>
               True Self
            </button>
            
            {users.length > 0 && (
               <div className="max-h-32 overflow-y-auto pr-1 space-y-1">
                  {users.filter(u => u.userId !== currentUser.userId).map(u => (
                     <button
                        key={u.userId}
                        onClick={() => {
                           setViewAsUserId(u.userId);
                           setOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${viewAsUser?.userId === u.userId ? 'text-destructive font-medium' : 'text-foreground'}`}
                     >
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>person</span>
                        <span className="truncate">{u.displayName}</span>
                     </button>
                  ))}
               </div>
            )}
          </div>
        )}

        <div className="p-2 border-t border-border">
          <button 
            onClick={() => {
              setOpen(false);
              logout();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors text-muted-foreground"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>logout</span>
            Sign out
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
