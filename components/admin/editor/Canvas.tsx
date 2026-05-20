'use client';

import { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Rect, Text, Image as KonvaImage, Group } from 'react-konva';
import { useEditorStore, type CanvasElement } from '@/lib/editor/useEditorStore';
import Konva from 'konva';

const ARTBOARD_WIDTH = 1200;
const ARTBOARD_HEIGHT = 800;
const GRID_SIZE = 20;

export default function Canvas() {
  const stageRef = useRef<Konva.Stage>(null);
  const {
    currentPage,
    selectedElementIds,
    selectElement,
    deselectAll,
    updateElement,
    scale,
    setScale,
    offsetX,
    offsetY,
    setOffset,
    gridVisible,
    toggleGrid,
  } = useEditorStore();

  const [images, setImages] = useState<{ [key: string]: HTMLImageElement }>({});

  // Load images
  useEffect(() => {
    if (!currentPage) return;

    const loadImages = async () => {
      const newImages: { [key: string]: HTMLImageElement } = {};
      const imageElements = currentPage.elements.filter((el) => el.type === 'image' && el.src);

      for (const el of imageElements) {
        if (el.src && !images[el.id]) {
          const img = new window.Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            newImages[el.id] = img;
            setImages((prev) => ({ ...prev, [el.id]: img }));
          };
          img.src = el.src;
        }
      }
    };

    loadImages();
  }, [currentPage, images]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Delete key
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        selectedElementIds.forEach((id) => {
          // TODO: implement deleteElement
        });
      }

      // Ctrl+Z (Undo)
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        // TODO: implement undo
      }

      // Ctrl+Shift+Z (Redo)
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        // TODO: implement redo
      }

      // G toggle grid
      if (e.key === 'g' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        toggleGrid();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementIds, toggleGrid]);

  // Handle wheel zoom
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const scaleBy = 1.1;
      const stage = stageRef.current;
      if (!stage) return;

      const oldScale = stage.scaleX();
      const mousePointTo = {
        x: stage.getPointerPosition()!.x / oldScale - stage.x() / oldScale,
        y: stage.getPointerPosition()!.y / oldScale - stage.y() / oldScale,
      };

      const newScale = e.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
      const newScale_clamped = Math.max(0.1, Math.min(5, newScale));

      setScale(newScale_clamped);

      const newPos = {
        x: -(mousePointTo.x - stage.getPointerPosition()!.x / newScale_clamped) * newScale_clamped,
        y: -(mousePointTo.y - stage.getPointerPosition()!.y / newScale_clamped) * newScale_clamped,
      };

      stage.scale({ x: newScale_clamped, y: newScale_clamped });
      stage.position(newPos);
      setOffset(newPos.x, newPos.y);
    };

    stage.container().addEventListener('wheel', handleWheel, { passive: false });
    return () => stage.container().removeEventListener('wheel', handleWheel);
  }, [setScale, setOffset]);

  if (!currentPage) return null;

  const renderElement = (element: CanvasElement): React.ReactNode => {
    const isSelected = selectedElementIds.includes(element.id);
    const stroke = isSelected ? '#3b82f6' : 'transparent';
    const strokeWidth = isSelected ? 2 : 0;

    switch (element.type) {
      case 'text':
        return (
          <Group
            key={element.id}
            x={element.x}
            y={element.y}
            draggable={!element.locked}
            onDragEnd={(e) => {
              updateElement(element.id, { x: e.target.x(), y: e.target.y() });
            }}
            onClick={() => selectElement(element.id)}
          >
            <Rect
              width={element.width}
              height={element.height}
              fill="transparent"
              stroke={stroke}
              strokeWidth={strokeWidth}
            />
            <Text
              text={element.content || 'Text'}
              width={element.width}
              height={element.height}
              fontSize={element.fontSize || 16}
              fontFamily={element.fontFamily || 'Arial'}
              fontStyle={element.fontWeight === 700 ? 'bold' : 'normal'}
              fill={element.color || '#000'}
              align={element.textAlign || 'left'}
              verticalAlign="top"
              padding={8}
            />
          </Group>
        );

      case 'image':
        return (
          <Group
            key={element.id}
            x={element.x}
            y={element.y}
            draggable={!element.locked}
            onDragEnd={(e) => {
              updateElement(element.id, { x: e.target.x(), y: e.target.y() });
            }}
            onClick={() => selectElement(element.id)}
          >
            <Rect
              width={element.width}
              height={element.height}
              fill={element.fill || '#e5e7eb'}
              stroke={stroke}
              strokeWidth={strokeWidth}
            />
            {images[element.id] && (
              <KonvaImage
                image={images[element.id]}
                width={element.width}
                height={element.height}
              />
            )}
          </Group>
        );

      case 'shape':
        return (
          <Group
            key={element.id}
            x={element.x}
            y={element.y}
            draggable={!element.locked}
            onDragEnd={(e) => {
              updateElement(element.id, { x: e.target.x(), y: e.target.y() });
            }}
            onClick={() => selectElement(element.id)}
          >
            <Rect
              width={element.width}
              height={element.height}
              fill={element.fill || '#3b82f6'}
              stroke={stroke}
              strokeWidth={strokeWidth}
              cornerRadius={element.borderRadius || 0}
            />
          </Group>
        );

      case 'button':
        return (
          <Group
            key={element.id}
            x={element.x}
            y={element.y}
            draggable={!element.locked}
            onDragEnd={(e) => {
              updateElement(element.id, { x: e.target.x(), y: e.target.y() });
            }}
            onClick={() => selectElement(element.id)}
          >
            <Rect
              width={element.width}
              height={element.height}
              fill={element.fill || '#3b82f6'}
              stroke={stroke}
              strokeWidth={strokeWidth}
              cornerRadius={element.borderRadius || 4}
            />
            <Text
              text={element.content || 'Button'}
              width={element.width}
              height={element.height}
              fontSize={element.fontSize || 14}
              fill={element.color || '#fff'}
              align="center"
              verticalAlign="middle"
            />
          </Group>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex-1 overflow-hidden bg-slate-100 relative">
      <Stage
        ref={stageRef}
        width={typeof window !== 'undefined' ? window.innerWidth - 320 : 1000}
        height={typeof window !== 'undefined' ? window.innerHeight - 64 : 600}
        scale={{ x: scale, y: scale }}
        position={{ x: offsetX, y: offsetY }}
        onMouseDown={(e) => {
          if (e.target === e.target.getStage()) {
            deselectAll();
          }
        }}
      >
        <Layer>
          {/* Grid */}
          {gridVisible && (
            <Group>
              {Array.from({ length: Math.ceil(3000 / GRID_SIZE) }).map((_, i) => (
                <Rect
                  key={`grid-h-${i}`}
                  x={0}
                  y={i * GRID_SIZE}
                  width={3000}
                  height={1}
                  fill="#e5e7eb"
                />
              ))}
              {Array.from({ length: Math.ceil(3000 / GRID_SIZE) }).map((_, i) => (
                <Rect
                  key={`grid-v-${i}`}
                  x={i * GRID_SIZE}
                  y={0}
                  width={1}
                  height={3000}
                  fill="#e5e7eb"
                />
              ))}
            </Group>
          )}

          {/* Artboard */}
          <Rect
            x={150}
            y={100}
            width={ARTBOARD_WIDTH}
            height={ARTBOARD_HEIGHT}
            fill="#ffffff"
            stroke="#d1d5db"
            strokeWidth={1}
          />

          {/* Elements */}
          {currentPage.elements.map((element) => renderElement(element))}
        </Layer>
      </Stage>

      {/* Zoom Controls */}
      <div className="absolute bottom-4 right-4 flex gap-2 bg-white rounded-lg shadow-md p-2">
        <button
          onClick={() => setScale(Math.max(0.1, scale - 0.1))}
          className="px-3 py-1 text-sm font-medium border border-slate-200 rounded hover:bg-slate-50"
        >
          −
        </button>
        <div className="px-3 py-1 text-sm font-medium text-slate-600 min-w-12 text-center">
          {Math.round(scale * 100)}%
        </div>
        <button
          onClick={() => setScale(Math.min(5, scale + 0.1))}
          className="px-3 py-1 text-sm font-medium border border-slate-200 rounded hover:bg-slate-50"
        >
          +
        </button>
      </div>
    </div>
  );
}
