import React from 'react';
import { useAuth } from '../hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';

export default function Overview() {
  const { currentUser } = useAuth();

  return (
    <div className="h-full p-8 animate-in fade-in duration-500">
      {/* Seamless Top - No Header/Title */}
      <div className="mb-8">
         <h2 className="text-2xl font-thin tracking-wide mb-2">Welcome back, {currentUser?.displayName?.split(' ')[0]}</h2>
         <p className="text-muted-foreground text-sm">Here is a quick look at your workspace activity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Stat Card 1 */}
        <Card className="bg-transparent font-emphasis">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground transition-colors">
              Active Tasks
            </CardTitle>
            <span className="material-symbols-outlined text-primary/70" style={{ fontSize: '20px' }}>schedule</span>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-3xl font-thin tracking-wider">12</div>
          </CardContent>
        </Card>

        {/* Stat Card 2 */}
        <Card className="bg-transparent font-emphasis">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground transition-colors">
              Due Soon
            </CardTitle>
            <span className="material-symbols-outlined text-destructive/70" style={{ fontSize: '20px' }}>warning</span>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-3xl font-thin tracking-wider">3</div>
          </CardContent>
        </Card>

        {/* Stat Card 3 */}
        <Card className="bg-transparent font-emphasis">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground transition-colors">
              Completed
            </CardTitle>
            <span className="material-symbols-outlined text-green-500/70" style={{ fontSize: '20px' }}>check_circle</span>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-3xl font-thin tracking-wider">48</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Recent Assignments Activity Feed */}
         <Card className="bg-transparent">
            <CardHeader className="p-4 border-b border-border mb-4">
               <CardTitle className="font-thin tracking-wide flex items-center gap-2">
                  <span className="material-symbols-outlined text-muted-foreground" style={{ fontSize: '24px' }}>assignment_ind</span>
                  Recent Assignments
               </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-4 text-sm text-muted-foreground">
               <div className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                  <div>
                     <p className="text-foreground font-medium">Review Q3 Marketing Assets</p>
                     <p className="text-xs">Assigned by Jessica 2 hours ago</p>
                  </div>
               </div>
               <div className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                  <div>
                     <p className="text-foreground font-medium">Finalize Pitch Deck formatting</p>
                     <p className="text-xs">Assigned by System 1 day ago</p>
                  </div>
               </div>
               <div className="flex items-start gap-4 opacity-50">
                  <div className="w-2 h-2 rounded-full bg-border mt-1.5" />
                  <div>
                     <p className="text-foreground">Approve Vendor Invoices</p>
                     <p className="text-xs">Completed 2 days ago</p>
                  </div>
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
