import React, { useState } from 'react';
import { useAuth } from '../hooks/use-auth';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { CompactActionDialog } from '../components/common/compact-action-dialog';

export default function Teams() {
  const { users } = useAuth();
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Mock teams
  const teams = [
     { id: '1', name: 'Global Marketing', members: users.slice(0, 2), icon: 'public' },
     { id: '2', name: 'Backend Engineering', members: users.slice(2, 4), icon: 'terminal' }
  ];

  return (
    <div className="h-full flex relative animate-in fade-in duration-500 overflow-hidden">
      
      {/* Main Content Area */}
      <div className="flex-1 p-8 flex flex-col min-w-0">
          <div className="flex items-center justify-between mb-8">
             <div className="flex items-center gap-2 text-muted-foreground">
                <span className="material-symbols-outlined text-[32px] font-thin">groups</span>
                <h1 className="text-3xl font-thin tracking-wide">Teams</h1>
             </div>
             <button className="flex items-center gap-2 text-muted-foreground transition-colors">
                <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>add_circle</span>
                <span className="font-thin tracking-widest uppercase text-xs">New Team</span>
             </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {teams.map(team => (
                 <Card 
                    key={team.id} 
                    className="bg-transparent cursor-pointer font-emphasis"
                    data-state={selectedTeam === team.id ? 'active' : 'inactive'}
                    onClick={() => {
                       setSelectedTeam(team.id);
                       setPanelOpen(true);
                    }}
                 >
                   <CardHeader className="p-4 flex flex-row items-center justify-between">
                      <div className="flex items-center gap-2">
                         <span className="material-symbols-outlined text-primary/70" style={{ fontSize: '24px' }}>{team.icon}</span>
                         <CardTitle className="text-lg font-medium">{team.name}</CardTitle>
                      </div>
                   </CardHeader>
                   <CardContent className="p-4 pt-0">
                      <div className="flex -space-x-2">
                         {team.members.map((u, i) => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-bold" title={u.displayName}>
                               {u.displayName.charAt(0)}
                            </div>
                         ))}
                         <div className="w-8 h-8 rounded-full border-2 border-background bg-background flex items-center justify-center border-dashed">
                             <span className="material-symbols-outlined text-muted-foreground" style={{ fontSize: '16px' }}>add</span>
                         </div>
                      </div>
                   </CardContent>
                </Card>
             ))}
          </div>
      </div>

      {/* Collapsible Shared Items Panel */}
      <div 
         className={`h-full border-l border-border bg-muted/10 transition-all duration-300 ease-in-out flex flex-col ${panelOpen ? 'w-96 p-6' : 'w-0 p-0 overflow-hidden border-none'}`}
      >
         <div className="flex items-center justify-between mb-8 whitespace-nowrap">
            <h3 className="text-lg font-medium tracking-wide">Team Details</h3>
            <button 
                onClick={() => setPanelOpen(false)}
                className="h-8 w-8 rounded flex items-center justify-center text-muted-foreground font-emphasis"
             >
               <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
            </button>
         </div>

         {selectedTeam && (
            <div className="flex-1 flex flex-col gap-6 min-w-0">
               {/* Team entity mechanics represented here */}
               <div className="p-4 border border-border/50 bg-background rounded-lg flex flex-col items-center text-center">
                   <div className="relative group w-16 h-16 rounded-lg bg-muted flex items-center justify-center mb-4">
                      <span className="material-symbols-outlined text-primary" style={{ fontSize: '32px' }}>{teams.find(t => t.id === selectedTeam)?.icon}</span>
                      <div className="absolute -bottom-2 -right-2 bg-background rounded-full p-0.5 border border-border">
                         {/* Link Overlay identifier */}
                         <span className="material-symbols-outlined text-[14px] text-muted-foreground">link</span>
                      </div>
                   </div>
                   <h4 className="font-medium">{teams.find(t => t.id === selectedTeam)?.name}</h4>
                   <p className="text-xs text-muted-foreground mt-1">Drag and drop badges here to assign to all members.</p>
               </div>
               
               <div className="flex-1 overflow-auto">
                   <h5 className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-3">Members</h5>
                   <div className="space-y-2">
                       {teams.find(t => t.id === selectedTeam)?.members.map((u, i) => (
                            <div key={i} className="flex items-center justify-between p-2 bg-background rounded font-emphasis border border-transparent transition-colors group">
                               <div className="flex items-center gap-2">
                                   <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">{u.displayName.charAt(0)}</div>
                                   <span className="text-sm">{u.displayName}</span>
                               </div>
                               <button className="opacity-0 group-hover:opacity-100 text-muted-foreground font-emphasis transition-all">
                                   <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>remove_circle</span>
                               </button>
                            </div>
                       ))}
                   </div>
               </div>

               {/* Delete Action strictly using CompactActionDialog */}
                <button 
                   onClick={() => setShowDeleteDialog(true)}
                   className="w-full py-2 flex items-center justify-center gap-2 text-destructive border border-destructive/20 font-emphasis rounded-md"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                  Delete Team
               </button>
            </div>
         )}
      </div>

      <CompactActionDialog
         open={showDeleteDialog}
         onOpenChange={setShowDeleteDialog}
         icon="warning"
         iconColor="text-destructive"
         title="Delete Team"
         description="Are you sure? This will irrevocably unbind all associated badges and access links for these members."
         onAction={() => {
            console.log("Deleted");
            setShowDeleteDialog(false);
            setPanelOpen(false);
         }}
      />
    </div>
  );
}
