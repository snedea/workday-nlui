import React, { useRef, useState } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';

interface DraggableWrapperProps {
  children: React.ReactNode;
  componentId: string;
  position?: { x: number; y: number };
  onPositionChange?: (id: string, position: { x: number; y: number }) => void;
  isDraggableMode?: boolean;
  zIndex?: number;
  onZIndexChange?: (id: string, zIndex: number) => void;
  onCollisionDetected?: (draggedId: string, newPos: { x: number; y: number }, bounds: DOMRect) => void;
}

export const DraggableWrapper: React.FC<DraggableWrapperProps> = ({
  children,
  componentId,
  position = { x: 0, y: 0 },
  onPositionChange,
  isDraggableMode = false,
  zIndex = 1,
  onZIndexChange,
  onCollisionDetected
}) => {
  // Use a ref to avoid the findDOMNode warning
  const nodeRef = useRef<HTMLDivElement>(null);

  // State to track if drag handle should be visible
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleStop = (_e: DraggableEvent, data: DraggableData) => {
    setIsDragging(false);
    onPositionChange?.(componentId, { x: data.x, y: data.y });
  };

  const handleStart = () => {
    setIsDragging(true);
  };

  const handleDrag = (_e: DraggableEvent, data: DraggableData) => {
    if (onCollisionDetected && nodeRef.current) {
      const bounds = nodeRef.current.getBoundingClientRect();
      const newPos = { x: data.x, y: data.y };
      onCollisionDetected(componentId, newPos, bounds);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    // Only hide if not actively dragging
    if (!isDragging) {
      setIsHovered(false);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Simple layering controls via keyboard shortcuts + right click
    const handleKeyDown = (keyEvent: KeyboardEvent) => {
      keyEvent.preventDefault();
      if (keyEvent.key === 'f' || keyEvent.key === 'F') {
        // Bring to front
        onZIndexChange?.(componentId, 9999);
      } else if (keyEvent.key === 'b' || keyEvent.key === 'B') {
        // Send to back
        onZIndexChange?.(componentId, 1);
      }
      document.removeEventListener('keydown', handleKeyDown);
    };

    document.addEventListener('keydown', handleKeyDown);

    // Show tooltip-like message
    const tooltip = document.createElement('div');
    tooltip.style.cssText = `
      position: fixed;
      top: ${e.clientY}px;
      left: ${e.clientX}px;
      background: #333;
      color: white;
      padding: 8px;
      border-radius: 4px;
      font-size: 12px;
      z-index: 10000;
      pointer-events: none;
    `;
    tooltip.textContent = 'Press F to bring to front, B to send to back';
    document.body.appendChild(tooltip);

    setTimeout(() => {
      document.removeEventListener('keydown', handleKeyDown);
      if (tooltip.parentNode) {
        document.body.removeChild(tooltip);
      }
    }, 3000);
  };

  if (!isDraggableMode) {
    return <>{children}</>;
  }

  // Handle should be visible if hovered or dragging
  const showHandle = isHovered || isDragging;

  return (
    <Draggable
      nodeRef={nodeRef}
      position={position}
      grid={[8, 8]} // Canvas Kit's 8px base unit
      handle=".drag-handle"
      onStart={handleStart}
      onDrag={handleDrag}
      onStop={handleStop}
    >
      <div
        ref={nodeRef}
        style={{
          position: (position.x !== 0 || position.y !== 0 || isDragging) ? 'absolute' : 'relative',
          zIndex: zIndex,
          cursor: isDragging ? 'grabbing' : 'default'
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onContextMenu={handleContextMenu}
      >
        {/* Drag handle - auto-hide when not hovered */}
        <div
          className={`drag-handle ${showHandle ? 'visible' : ''}`}
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

        <div>
          {children}
        </div>
      </div>
    </Draggable>
  );
};