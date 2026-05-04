import React from 'react';
import { useAuth } from '../hooks/use-auth';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';

export default function Notifications() {
  const { users, isAdmin, updateUser, deleteUser } = useAuth();
  
  // Method C Approval logic mock -> Now wired to real data!
  const pendingUsers = isAdmin ? users.filter(u => u.accountType === 'Viewer') : [];

  return (
    <div className="h-full p-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-8 text-muted-foreground border-b border-border pb-4">
         <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>
           notifications
         </span>
         <h1 className="text-3xl font-thin tracking-wide">Notifications</h1>
      </div>

      <div className="space-y-6">
        
        {/* Method C Approval Requests (Admins Only) */}
        {isAdmin && pendingUsers.length > 0 && (
          <div className="space-y-4">
             <h2 className="text-lg font-medium tracking-wide flex items-center gap-2 text-destructive">
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>security</span>
                Access Requests
             </h2>
             {pendingUsers.map(user => (
               <Card key={user.userId} className="bg-destructive/5 border-destructive/20">
                 <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center font-bold text-destructive">
                          {user.displayName.charAt(0)}
                       </div>
                       <div>
                          <p className="font-medium">{user.displayName} <span className="text-muted-foreground font-normal text-sm ml-2">{user.email}</span></p>
                          <p className="text-xs text-muted-foreground mt-1">Requested access to this workspace.</p>
                       </div>
                    </div>
                     <div className="flex items-center gap-2">
                        <button onClick={() => deleteUser(user.userId)} className="px-4 py-2 text-sm font-emphasis rounded-md text-muted-foreground">Reject</button>
                        <button onClick={() => updateUser(user.userId, { accountType: 'Full' })} className="px-4 py-2 text-sm bg-primary text-primary-foreground font-emphasis rounded-md flex items-center gap-2">
                           <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>check</span>
                           Approve
                        </button>
                     </div>
                 </CardContent>
               </Card>
             ))}
          </div>
        )}

        {/* Standard System Feed */}
        <div className="space-y-4">
             <h2 className="text-lg font-medium tracking-wide">System Feed</h2>
             <Card className="bg-transparent border-none shadow-none">
                 <CardContent className="p-0 space-y-2">
                    {/* Mock Notification Item */}
                    <div className="flex items-start gap-4 p-4 font-emphasis rounded-lg border border-transparent">
                       <span className="material-symbols-outlined text-primary mt-1" style={{ fontSize: '24px' }}>update</span>
                       <div>
                          <p className="font-medium text-sm">System Update Applied</p>
                          <p className="text-muted-foreground text-sm mt-1">The V4 Blueprint layouts have been fully propagated to the Edge.</p>
                          <p className="text-xs text-muted-foreground mt-2 opacity-50">Just now</p>
                       </div>
                    </div>
                    
                    {/* Mock Notification Item */}
                    <div className="flex items-start gap-4 p-4 font-emphasis rounded-lg border border-transparent">
                       <span className="material-symbols-outlined text-muted-foreground mt-1" style={{ fontSize: '24px' }}>forum</span>
                       <div>
                          <p className="font-medium text-sm">Jessica mentioned you</p>
                          <p className="text-muted-foreground text-sm mt-1">"Can we push the production schedule to 14:00?"</p>
                          <p className="text-xs text-muted-foreground mt-2 opacity-50">2 hours ago</p>
                       </div>
                    </div>
                 </CardContent>
             </Card>
        </div>

      </div>
    </div>
  );
}
