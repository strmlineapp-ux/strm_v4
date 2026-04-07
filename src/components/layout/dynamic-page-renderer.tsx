import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/use-auth';

// A dynamic router that acts as the traffic controller resolving paths to tabs
export function DynamicPageRenderer() {
  const { pagePath } = useParams();
  const { appSettings } = useAuth();
  
  // Find which page we are supposed to render based on the URL wildcard 
  // (e.g., if pagePath is "overview", match it against appSettings)
  const matchingPage = appSettings.pages.find(p => p.path === `/dashboard/${pagePath}`);

  if (!matchingPage) {
     return <Navigate to="/dashboard/overview" replace />;
  }

  return (
     <div className="p-8 h-full">
         {/* Render the unified UI. In reality here you would branch to tasks-tab, calendar-tab etc. */}
         <div className="flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-muted-foreground mr-2" style={{ fontSize: '32px', fontVariationSettings: "'wght' 100" }}>
               {matchingPage.icon}
             </span>
             <h1 className="text-3xl font-thin tracking-wide">{matchingPage.name}</h1>
         </div>
         
         <div className="text-muted-foreground">
             Resolving dynamic tabs for {matchingPage.id}...
             <pre className="mt-4 p-4 border rounded-md text-xs">{JSON.stringify(matchingPage.associatedTabs, null, 2)}</pre>
         </div>
     </div>
  );
}
