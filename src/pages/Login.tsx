import React from 'react';
import { useAuth } from '../hooks/use-auth';

export default function Login() {
  const { loginWithGoogle, isAuthenticated, isPending, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex bg-background min-h-screen items-center justify-center">
        <span className="material-symbols-outlined animate-spin" style={{ fontSize: '48px' }}>
          sync
        </span>
      </div>
    );
  }

  // Pending implies Method C scenario where viewer request is intercepted
  if (isPending) {
    return (
      <div className="flex flex-col bg-background min-h-screen items-center justify-center p-8 text-center text-foreground flex-col gap-4">
         <span className="material-symbols-outlined" style={{ fontSize: '48px' }}>
           lock_person
         </span>
         <h1 className="text-2xl font-light">Access Pending</h1>
         <p className="text-muted-foreground">Your account has been requested. An administrator must approve your access.</p>
      </div>
    );
  }

  return (
    <div className="flex bg-background min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-8 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-8">
           <span className="material-symbols-outlined" style={{ fontSize: '48px' }}>
             water_lux
           </span>
           <span className="text-4xl font-thin tracking-wide">Strm_</span>
        </div>
        
        {/* Text-Based Input aesthetic simulating sign in with minimal UI footprint */}
        <button 
          onClick={loginWithGoogle}
          className="flex w-full items-center justify-center gap-3 bg-transparent font-emphasis border border-input rounded-md px-6 py-4"
        >
          <span className="material-symbols-outlined text-muted-foreground mr-2 transition-colors">
            login
          </span>
          <span className="font-medium text-foreground tracking-wide">Sign in with Google</span>
        </button>
      </div>
    </div>
  );
}
