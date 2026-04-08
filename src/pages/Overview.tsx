import React from 'react';
import { useData } from '../hooks/use-data';
import { Card } from '../components/ui/card';
import { InlineEditor } from '../components/common/inline-editor';

export default function Overview() {
  const { projects, loading, updateProjectName } = useData();

  return (
    <div className="h-full">
      <div className="flex items-center gap-2 mb-8 text-muted-foreground p-8 pb-0">
         <span className="material-symbols-outlined" style={{ fontSize: '32px', fontVariationSettings: "'wght' 100" }}>
           deployed_code
         </span>
         <h1 className="text-3xl font-thin tracking-wide">Workspace Overview</h1>
      </div>

      <div className="p-8 pt-4">
        {loading ? (
            <p className="text-muted-foreground italic">Streaming Edge Layout...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 content-start" style={{ columnGap: '1.5rem' }}>
            {projects.length === 0 && (
              <p className="text-muted-foreground">No projects found. Add one directly to Firebase to see instant tracking!</p>
            )}
            
            {projects.map((proj: any) => (
              <Card key={proj.id}>
                {/* V4 DND Compatible Header with native InlineEditor logic */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span 
                      className="material-symbols-outlined text-primary/70" 
                      style={{ fontSize: '20px', fontVariationSettings: "'wght' 200" }}
                    >
                      {proj.icon || 'folder'}
                    </span>
                    <InlineEditor 
                       value={proj.name} 
                       onSave={(newName) => updateProjectName(proj.id, newName)}
                       className="text-base font-medium max-w-[200px]"
                    />
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <span className="material-symbols-outlined" style={{ fontSize: '14px', fontVariationSettings: "'wght' 200" }}>database</span>
                    {proj.workspaceId}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
