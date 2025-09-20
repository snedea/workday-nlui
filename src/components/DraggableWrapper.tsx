import React, { useRef } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';

interface DraggableWrapperProps {
  children: React.ReactNode;
  componentId: string;
  position?: { x: number; y: number };
  onPositionChange?: (id: string, position: { x: number; y: number }) => void;
  isDraggableMode?: boolean;
}

export const DraggableWrapper: React.FC<DraggableWrapperProps> = ({
  children,
  componentId,
  position = { x: 0, y: 0 },
  onPositionChange,
  isDraggableMode = false
}) => {
  // Use a ref to avoid the findDOMNode warning
  const nodeRef = useRef<HTMLDivElement>(null);

  const handleStop = (_e: DraggableEvent, data: DraggableData) => {
    onPositionChange?.(componentId, { x: data.x, y: data.y });
  };

  if (!isDraggableMode) {
    return <>{children}</>;
  }

  return (
    <Draggable
      nodeRef={nodeRef}
      position={position}
      grid={[8, 8]} // Canvas Kit's 8px base unit
      handle=".drag-handle"
      onStop={handleStop}
    >
      <div ref={nodeRef} style={{ position: 'relative', display: 'inline-block' }}>
        {/* Drag handle - only visible in draggable mode */}
        <div
          className="drag-handle"
          style={{
            position: 'absolute',
            top: -8,
            left: -8,
            width: 16,
            height: 16,
            backgroundColor: '#0875e1',
            borderRadius: '50%',
            cursor: 'grab',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '8px',
            color: 'white',
            fontWeight: 'bold',
            userSelect: 'none',
            border: '1px solid #ffffff',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}
        >
          ⋮⋮
        </div>

        <div style={{ pointerEvents: isDraggableMode ? 'none' : 'auto' }}>
          {children}
        </div>
      </div>
    </Draggable>
  );
};