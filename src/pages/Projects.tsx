import React from 'react';
import { useData } from '../hooks/use-data';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { InlineEditor } from '../components/common/inline-editor';
import { IconColorPicker } from '../components/common/icon-color-picker';

export default function Projects() {
  const { projects, updateProjectName } = useData();

  return (
    <div className="h-full p-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
         <div className="flex items-center gap-2 text-muted-foreground">
            <span className="material-symbols-outlined text-[32px] font-thin">view_kanban</span>
            <h1 className="text-3xl font-thin tracking-wide">Projects</h1>
         </div>
         {/* Integrated Add Button */}
         <button className="flex items-center gap-2 text-muted-foreground transition-colors group">
            <span className="material-symbols-outlined group-hover:rotate-90 transition-transform duration-300" style={{ fontSize: '36px' }}>add_circle</span>
            <span className="font-thin tracking-widest uppercase text-xs">New Project</span>
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {projects.length === 0 && (
           <p className="text-muted-foreground col-span-full">No projects tracked. Create one to begin.</p>
        )}
        
        {projects.map((proj: any) => (
          <Card key={proj.id} className="bg-transparent font-emphasis group">
            <CardHeader className="p-4 flex flex-row items-center justify-between pb-2 border-b border-border/10 mb-2">
              <div className="flex items-center gap-3">
                 <IconColorPicker 
                     iconName={proj.icon || 'folder'} 
                     initialColor="#0066ff" 
                     onColorChange={() => {}} 
                     onIconChange={() => {}} 
                 />
                 <InlineEditor 
                    value={proj.name} 
                    onSave={(newName) => updateProjectName(proj.id, newName)}
                    className="text-base font-medium max-w-[150px]"
                 />
              </div>
              <button className="p-1 text-muted-foreground font-emphasis">
                 <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>more_vert</span>
              </button>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-xs text-muted-foreground flex flex-col gap-2">
                 <div className="flex items-center justify-between">
                    <span>Database ID</span>
                    <span className="font-mono bg-muted/50 px-1.5 py-0.5 rounded text-[10px]">{proj.workspaceId}</span>
                 </div>
                 <div className="flex flex-wrap gap-1 mt-2">
                    {/* Badge Pill representation */}
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-medium tracking-wide">
                       Active Phase
                    </span>
                 </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
