import React from 'react';
import { Text, Rect, Image, Group } from 'react-konva';
import type { EditorElement } from '@/lib/editor/types';

interface ElementRendererProps {
  element: EditorElement;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDragEnd: (id: string, x: number, y: number) => void;
  onTransformEnd: (id: string, x: number, y: number, width: number, height: number, scaleX: number, scaleY: number) => void;
}

export const ElementRenderer: React.FC<ElementRendererProps> = ({
  element,
  isSelected,
  onSelect,
  onDragEnd,
  onTransformEnd,
}) => {
  const getCommonProps = () => ({
    x: element.x,
    y: element.y,
    width: element.width,
    height: element.height,
    opacity: element.opacity,
    onClick: () => onSelect(element.id),
    onDragEnd: (e: any) => {
      onDragEnd(element.id, e.target.x(), e.target.y());
    },
  });

  switch (element.type) {
    case 'text':
      return (
        <Text
          {...getCommonProps()}
          text={element.content || 'Text'}
          fontSize={element.fontSize || 16}
          fontFamily={element.fontFamily || 'Arial'}
          fontStyle={element.fontWeight === 'bold' ? 'bold' : element.fontStyle === 'italic' ? 'italic' : 'normal'}
          fill={element.color || '#000000'}
          align={element.textAlign || 'left'}
          verticalAlign="top"
          draggable
          listening
        />
      );

    case 'rectangle':
      return (
        <Rect
          {...getCommonProps()}
          fill={element.backgroundColor || '#ffffff'}
          stroke={element.borderColor || '#000000'}
          strokeWidth={element.borderWidth || 1}
          cornerRadius={element.borderRadius || 0}
          draggable
          listening
        />
      );

    case 'image':
      return (
        <Image
          {...getCommonProps()}
          image={element.src ? new window.Image() : undefined}
          draggable
          listening
        />
      );

    case 'button':
      return (
        <Group {...getCommonProps()} draggable listening>
          <Rect
            x={0}
            y={0}
            width={element.width}
            height={element.height}
            fill={element.backgroundColor || '#0066cc'}
            stroke={element.borderColor || '#0066cc'}
            strokeWidth={element.borderWidth || 0}
            cornerRadius={element.borderRadius || 4}
          />
          <Text
            x={0}
            y={0}
            width={element.width}
            height={element.height}
            text={element.content || 'Button'}
            fontSize={element.fontSize || 14}
            fill={element.color || '#ffffff'}
            align="center"
            verticalAlign="middle"
          />
        </Group>
      );

    case 'frame':
      return (
        <Group {...getCommonProps()} draggable listening>
          <Rect
            x={0}
            y={0}
            width={element.width}
            height={element.height}
            fill={element.backgroundColor || '#ffffff'}
            stroke={element.borderColor || '#cccccc'}
            strokeWidth={1}
            cornerRadius={element.borderRadius || 0}
          />
        </Group>
      );

    case 'link':
      return (
        <Text
          {...getCommonProps()}
          text={element.content || 'Link'}
          fontSize={element.fontSize || 16}
          fill={element.color || '#0066cc'}
          underline
          draggable
          listening
        />
      );

    case 'shape':
      return (
        <Rect
          {...getCommonProps()}
          fill={element.backgroundColor || '#cccccc'}
          stroke={element.borderColor || '#999999'}
          strokeWidth={element.borderWidth || 1}
          cornerRadius={element.borderRadius || 0}
          draggable
          listening
        />
      );

    default:
      return null;
  }
};
