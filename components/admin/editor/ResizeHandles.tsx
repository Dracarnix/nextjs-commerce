'use client';

import { Circle, Group } from 'react-konva';
import Konva from 'konva';

const HANDLE_SIZE = 6;

interface ResizeHandlesProps {
  x: number;
  y: number;
  width: number;
  height: number;
  onResize: (x: number, y: number, width: number, height: number) => void;
}

export function ResizeHandles({ x, y, width, height, onResize }: ResizeHandlesProps) {
  const handles = [
    { name: 'top-left', x: 0, y: 0 },
    { name: 'top-center', x: width / 2, y: 0 },
    { name: 'top-right', x: width, y: 0 },
    { name: 'middle-left', x: 0, y: height / 2 },
    { name: 'middle-right', x: width, y: height / 2 },
    { name: 'bottom-left', x: 0, y: height },
    { name: 'bottom-center', x: width / 2, y: height },
    { name: 'bottom-right', x: width, y: height },
  ];

  return (
    <Group>
      {handles.map((handle) => (
        <Circle
          key={handle.name}
          x={handle.x}
          y={handle.y}
          radius={HANDLE_SIZE}
          fill="#3b82f6"
          stroke="#fff"
          strokeWidth={1}
          draggable
          onDragMove={(e) => {
            const node = e.target;
            const newX = node.x();
            const newY = node.y();

            let updatedWidth = width;
            let updatedHeight = height;
            let updatedX = x;
            let updatedY = y;

            if (handle.name.includes('left')) {
              updatedWidth = width + (x - newX);
              updatedX = newX;
            } else if (handle.name.includes('right')) {
              updatedWidth = newX;
            }

            if (handle.name.includes('top')) {
              updatedHeight = height + (y - newY);
              updatedY = newY;
            } else if (handle.name.includes('bottom')) {
              updatedHeight = newY;
            }

            updatedWidth = Math.max(20, updatedWidth);
            updatedHeight = Math.max(20, updatedHeight);

            onResize(updatedX, updatedY, updatedWidth, updatedHeight);
          }}
          onDragEnd={(e) => {
            e.target.x(0);
            e.target.y(0);
          }}
        />
      ))}
    </Group>
  );
}
