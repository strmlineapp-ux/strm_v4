import React, { useState } from 'react';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { InlineEditor } from '../components/common/inline-editor';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';

// Mock Data
const INITIAL_TASKS = {
  inProgress: [
    { id: '1', title: 'Compile Final Assets', assignedTo: 'Jessica' },
    { id: '2', title: 'Write Release Notes', assignedTo: 'System' }
  ],
  awaitingReview: [
    { id: '3', title: 'Update V4 Blueprint Docs', assignedTo: 'Admin' }
  ]
};

// Sortable Item wrapper
function TaskRow({ task, id }: { task: any, id: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className={`group flex items-center justify-between p-3 border-b border-border/50 bg-background/50 font-emphasis transition-colors ${isDragging ? 'border-primary' : ''}`}
    >
        <div className="flex flex-col">
           {/* Stop propagation so clicking text doesn't drag */}
           <div onPointerDownCapture={(e) => e.stopPropagation()}>
               <InlineEditor 
                   value={task.title} 
                   className="font-medium text-sm"
                   onSave={(newVal) => console.log('Saved:', newVal)}
               />
           </div>
           <span className="text-xs text-muted-foreground mt-1">Assigned to {task.assignedTo}</span>
        </div>
        
        {/* Standard Task Context Menu */}
        <button 
           className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-muted-foreground font-emphasis"
           onPointerDownCapture={(e) => e.stopPropagation()}
        >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>more_horiz</span>
        </button>
    </div>
  );
}

// Droppable Container
function Swimlane({ id, title, tasks }: { id: string, title: string, tasks: any[] }) {
  return (
    <Card className="bg-transparent border-none shadow-none">
       <CardHeader className="px-0 py-2 border-b border-border mb-2">
           <CardTitle className="font-thin tracking-widest text-sm uppercase text-muted-foreground">{title}</CardTitle>
       </CardHeader>
       <CardContent className="p-0">
          <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col min-h-[100px]">
              {tasks.map(task => <TaskRow key={task.id} id={task.id} task={task} />)}
            </div>
          </SortableContext>
       </CardContent>
    </Card>
  );
}

export default function Tasks() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    if (activeId === overId) return;

    setTasks((prev) => {
      let activeContainer = 'inProgress';
      let overContainer = 'inProgress';
      
      const inProgressIds = prev.inProgress.map(t => t.id);
      const awaitingReviewIds = prev.awaitingReview.map(t => t.id);

      if (inProgressIds.includes(activeId)) activeContainer = 'inProgress';
      if (awaitingReviewIds.includes(activeId)) activeContainer = 'awaitingReview';
      
      if (inProgressIds.includes(overId) || overId === 'col-in-progress') overContainer = 'inProgress';
      if (awaitingReviewIds.includes(overId) || overId === 'col-awaiting-review') overContainer = 'awaitingReview';

      const activeItems = [...prev[activeContainer as keyof typeof prev]];
      const overItems = [...prev[overContainer as keyof typeof prev]];

      const activeIndex = activeItems.findIndex(t => t.id === activeId);
      const taskToMove = activeItems[activeIndex];

      if (activeContainer === overContainer) {
        const overIndex = overItems.findIndex(t => t.id === overId);
        const newItems = [...activeItems];
        newItems.splice(activeIndex, 1);
        newItems.splice(overIndex, 0, taskToMove);
        return { ...prev, [activeContainer]: newItems };
      } else {
        activeItems.splice(activeIndex, 1);
        overItems.push(taskToMove);
        return {
          ...prev,
          [activeContainer]: activeItems,
          [overContainer]: overItems
        };
      }
    });
  };

  return (
    <div className="h-full p-8 animate-in fade-in duration-500">
      
      {/* Seamless Header */}
      <div className="mb-8">
         <h2 className="text-2xl font-thin tracking-wide mb-2">My Deliverables</h2>
         <p className="text-muted-foreground text-sm">Organize and manage your specific cross-project tasks here.</p>
         
         <div className="mt-8 flex items-center">
            {/* The Integrated Add Button Pattern */}
            <button className="flex items-center gap-2 text-muted-foreground transition-colors group">
               <span className="material-symbols-outlined group-hover:rotate-90 transition-transform duration-300" style={{ fontSize: '36px' }}>add_circle</span>
               <span className="font-thin tracking-widest uppercase text-xs">New Task</span>
            </button>
         </div>
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <Swimlane id="col-in-progress" title="In Progress" tasks={tasks.inProgress} />
            <Swimlane id="col-awaiting-review" title="Awaiting Review" tasks={tasks.awaitingReview} />
         </div>
      </DndContext>
      
    </div>
  );
}
