import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/use-auth';

export function Sidebar() {
  const { appSettings, viewAsUser, users, setViewAsUserId, isAdmin, isImpersonating, logout } = useAuth();
  
  if (!viewAsUser) return null;

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-16 flex-col bg-transparent border-r border-border sm:flex items-center py-6 gap-6">
       
      {/* Brand Icon */}
      <NavLink to="/dashboard" className="mb-4">
         <span className="material-symbols-outlined text-primary hover:text-accent" style={{ fontSize: '36px', fontVariationSettings: "'wght' 100" }}>water_lux</span>
      </NavLink>

      {/* Dynamic Route iteration from Context appSettings */}
      <nav className="flex flex-col gap-4">
        {appSettings.pages.map(page => (
          <NavLink 
            key={page.id}
            to={page.path}
            className={({ isActive }) => 
              `w-10 h-10 flex items-center justify-center rounded-lg transition-colors 
               ${isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`
            }
            title={page.name}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '24px', fontVariationSettings: "'wght' 200" }}>
              {page.icon}
            </span>
          </NavLink>
        ))}
      </nav>

      {/* Profile & Impersonator Logic at the bottom */}
      <div className="mt-auto flex flex-col gap-4 items-center">
        {/* Impersonation toggle purely mapped through HTML Select to avoid heavy Radix Dropdowns */}
        {isAdmin && users.length > 0 && (
           <div className="relative group">
              <span 
                 className={`material-symbols-outlined ${isImpersonating ? 'text-destructive' : 'text-muted-foreground'}`}
                 style={{ fontSize: '24px', fontVariationSettings: "'wght' 200" }}
                 title="View As Impersonator"
              >
                  how_to_reg
              </span>
              <select 
                 className="absolute inset-0 opacity-0 cursor-pointer"
                 onChange={(e) => setViewAsUserId(e.target.value === "self" ? null : e.target.value)}
              >
                  <option value="self">Return to True Self</option>
                  <option disabled>--- Impersonate ---</option>
                  {users.map(u => (
                      <option key={u.userId} value={u.userId}>{u.displayName}</option>
                  ))}
              </select>
           </div>
        )}
        
        <button onClick={logout} className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: '24px', fontVariationSettings: "'wght' 200" }}>logout</span>
        </button>

      </div>
    </aside>
  );
}
