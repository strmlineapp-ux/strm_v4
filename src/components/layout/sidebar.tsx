import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/use-auth';
import { UserMenu } from './user-menu';

export function Sidebar() {
  const { appSettings, currentUser, viewAsUser, isAdmin, logout } = useAuth();
  
  const activeProfile = viewAsUser || currentUser;
  if (!activeProfile) return null;

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-16 flex-col bg-transparent border-r border-border sm:flex items-center py-6 gap-6">
       
      {/* Brand Icon */}
      <NavLink to="/dashboard" className="mb-4">
         <span className="material-symbols-outlined text-primary font-emphasis" style={{ fontSize: '36px' }}>water_lux</span>
      </NavLink>

      {/* Dynamic Route iteration from Context appSettings */}
      <nav className="flex flex-col gap-4">
        {appSettings.pages.map(page => (
          <NavLink 
            key={page.id}
            to={page.path}
            className="w-10 h-10 flex items-center justify-center rounded-lg transition-colors text-muted-foreground"
            title={page.name}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
              {page.icon}
            </span>
          </NavLink>
        ))}
      </nav>

      {/* Profile & Impersonator Logic at the bottom */}
      <div className="mt-auto flex flex-col gap-4 items-center pb-4">
        <UserMenu />
      </div>
    </aside>
  );
}
