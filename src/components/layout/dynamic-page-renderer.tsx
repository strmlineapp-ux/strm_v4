import React, { Suspense, lazy } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/use-auth';

const PAGE_MAP: Record<string, React.LazyExoticComponent<any>> = {
  'overview': lazy(() => import('../../pages/Overview')),
  'calendar': lazy(() => import('../../pages/Calendar')),
  'tasks': lazy(() => import('../../pages/Tasks')),
  'admin': lazy(() => import('../../pages/Admin')),
  'settings': lazy(() => import('../../pages/Settings')),
  'notifications': lazy(() => import('../../pages/Notifications')),
  'teams': lazy(() => import('../../pages/Teams')),
  'projects': lazy(() => import('../../pages/Projects')),
};

// A dynamic router that acts as the traffic controller resolving paths to tabs
export function DynamicPageRenderer() {
  const { pagePath } = useParams();
  const { appSettings } = useAuth();
  
  const isStaticUserRoute = ['settings', 'notifications', 'teams', 'projects'].includes(pagePath || '');

  // Find which page we are supposed to render based on the URL wildcard 
  const matchingPage = appSettings.pages.find(p => p.path === `/dashboard/${pagePath}`);

  if (!matchingPage && !isStaticUserRoute) {
     return <Navigate to="/dashboard/overview" replace />;
  }

  const PageComponent = PAGE_MAP[pagePath as string];

  if (!PageComponent) {
     return (
        <div className="p-8 h-full text-destructive">
           Page component for "{pagePath}" not found in PAGE_MAP.
        </div>
     );
  }

  return (
    <Suspense fallback={
        <div className="flex items-center justify-center p-8 h-full text-muted-foreground w-full">
            <span className="material-symbols-outlined animate-spin text-3xl">radio_button_unchecked</span>
        </div>
    }>
        <PageComponent />
    </Suspense>
  );
}
