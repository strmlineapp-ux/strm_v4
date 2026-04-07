import React, { useState } from 'react';
import {
  DndContext,
  pointerWithin,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverlay,
  Modifier
} from '@dnd-kit/core';

export interface StrmDndProviderProps {
  children: React.ReactNode;
  onDragEnd: (event: DragEndEvent) => void;
  // Hook to provide custom overlay content during drag
  renderOverlayContent?: (activeId: string) => React.ReactNode;
}

// Global modifier enforcing cursor-centering on drag overlay 
// matching blueprint specifications.
const snapCenterToCursor: Modifier = ({ transform, activeNodeRect }) => {
  if (transform && activeNodeRect) {
    return {
      ...transform,
      x: transform.x + activeNodeRect.width / 2,
      y: transform.y + activeNodeRect.height / 2,
    };
  }
  return transform;
};

export const StrmDndProvider: React.FC<StrmDndProviderProps> = ({ 
  children, 
  onDragEnd,
  renderOverlayContent 
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  // Require a 5px drag intent to distinguish clicks (InlineEditor, Dialog triggers) from drags
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, 
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    // Setting a global body class during drag helps satisfy the blueprint rule:
    // "Interactive elements are hidden during active drags to ensure UI stability."
    // Components can use `.is-dragging & .delete-btn { display: none }` or similar CSS.
    document.body.classList.add('is-dragging');
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    document.body.classList.remove('is-dragging');
    onDragEnd(event);
  };

  const handleDragCancel = () => {
    setActiveId(null);
    document.body.classList.remove('is-dragging');
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin} // Dictated by Section 3 Blueprint
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      {children}
      
      {/* 
        This global DragOverlay isolates the moving element.
        The render prop allows specific pages to pass down custom icons or avatars,
        satisfying the blueprint's isolated visual dragging requirements.
      */}
      <DragOverlay dropAnimation={null} modifiers={[snapCenterToCursor]}>
        {activeId && renderOverlayContent ? renderOverlayContent(activeId) : null}
      </DragOverlay>
    </DndContext>
  );
};
