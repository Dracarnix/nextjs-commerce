'use client';

import { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Rect, Text, Image as KonvaImage, Group, Line } from 'react-konva';
import { useEditorStore, type CanvasElement } from '@/lib/editor/useEditorStore';
import { ResizeHandles } from './ResizeHandles';
import { getAlignmentGuides, snapToGuides, type Guide, type ElementBounds } from '@/lib/editor/alignmentGuides';
import Konva from 'konva';

const ARTBOARD_WIDTH = 1200;
const ARTBOARD_HEIGHT = 800;
const GRID_SIZE = 20;
const ARTBOARD_X = 150;
const ARTBOARD_Y = 100;

export default function Canvas() {
  const stageRef = useRef<Konva.Stage>(null);
  const [images, setImages] = useState<{ [key: string]: HTMLImageElement }>({});
  const [guides, setGuides] = useState<Guide[]>([]);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [boxSelectStart, setBoxSelectStart] = useState<{ x: number; y: number } | null>(null);
  const [boxSelectEnd, setBoxSelectEnd] = useState<{ x: number; y: number } | null>(null);

  const {
    pages,
    currentPageId,
    selectedElementIds,
    selectElement,
    deselectAll,
    updateElement,
    deleteSelectedElements,
    undo,
    redo,
    saveToHistory,
    zoomLevel,
    setZoom,
    panX,
    panY,
    setPan,
    showGrid,
    toggleGrid,
  } = useEditorStore();

  const currentPage = pages.find((p) => p.id === currentPageId);

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
      // Space key for panning
      if (e.code === 'Space' && !isSpacePressed) {
        e.preventDefault();
        setIsSpacePressed(true);
        const stage = stageRef.current;
        if (stage) {
          stage.container().style.cursor = 'grab';
        }
      }

      // Delete key
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElementIds.length > 0) {
        e.preventDefault();
        deleteSelectedElements();
        saveToHistory();
      }

      // Ctrl+Z (Undo)
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }

      // Ctrl+Shift+Z (Redo)
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        redo();
      }

      // G toggle grid
      if (e.key === 'g' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        toggleGrid();
      }

      // Ctrl+A select all
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        if (currentPage) {
          currentPage.elements.forEach((el) => selectElement(el.id, true));
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
        const stage = stageRef.current;
        if (stage) {
          stage.container().style.cursor = 'default';
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [selectedElementIds, deleteSelectedElements, saveToHistory, undo, redo, currentPage, selectElement, toggleGrid]);

  // Handle wheel zoom
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const scaleBy = 1.1;
      const oldScale = stage.scaleX();
      const mousePointTo = {
        x: stage.getPointerPosition()!.x / oldScale - stage.x() / oldScale,
        y: stage.getPointerPosition()!.y / oldScale - stage.y() / oldScale,
      };

      const newScale = e.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
      const newScale_clamped = Math.max(0.1, Math.min(5, newScale));

      setZoom(newScale_clamped);

      const newPos = {
        x: -(mousePointTo.x - stage.getPointerPosition()!.x / newScale_clamped) * newScale_clamped,
        y: -(mousePointTo.y - stage.getPointerPosition()!.y / newScale_clamped) * newScale_clamped,
      };

      stage.scale({ x: newScale_clamped, y: newScale_clamped });
      stage.position(newPos);
      setPan(newPos.x, newPos.y);
    };

    stage.container().addEventListener('wheel', handleWheel, { passive: false });
    return () => stage.container().removeEventListener('wheel', handleWheel);
  }, [setZoom, setPan]);

  const handleStageMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    if (!stage) return;

    // Box select start
    if (!isSpacePressed && e.target === stage) {
      const pos = stage.getPointerPosition();
      if (pos) {
        setBoxSelectStart({ x: pos.x, y: pos.y });
      }
    }

    // Space pan
    if (isSpacePressed) {
      stage.container().style.cursor = 'grabbing';
    }
  };

  const handleStageMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    if (!stage) return;

    // Box select
    if (boxSelectStart && !isSpacePressed) {
      const pos = stage.getPointerPosition();
      if (pos) {
        setBoxSelectEnd({ x: pos.x, y: pos.y });
      }
    }

    // Space pan
    if (isSpacePressed && e.evt.buttons === 1) {
      const dx = e.evt.movementX;
      const dy = e.evt.movementY;
      stage.position({ x: stage.x() + dx, y: stage.y() + dy });
      setPan(stage.x(), stage.y());
    }
  };

  const handleStageMouseUp = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (boxSelectStart && boxSelectEnd && currentPage) {
      const minX = Math.min(boxSelectStart.x, boxSelectEnd.x);
      const maxX = Math.max(boxSelectStart.x, boxSelectEnd.x);
      const minY = Math.min(boxSelectStart.y, boxSelectEnd.y);
      const maxY = Math.max(boxSelectStart.y, boxSelectEnd.y);

      deselectAll();
      currentPage.elements.forEach((el) => {
        if (
          el.x < maxX &&
          el.x + el.width > minX &&
          el.y < maxY &&
          el.y + el.height > minY
        ) {
          selectElement(el.id, true);
        }
      });

      setBoxSelectStart(null);
      setBoxSelectEnd(null);
    }

    if (isSpacePressed) {
      const stage = e.target.getStage();
      if (stage) {
        stage.container().style.cursor = 'grab';
      }
    }
  };

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
            onDragMove={(e) => {
              const newX = e.target.x();
              const newY = e.target.y();
              const otherElements = currentPage.elements
                .filter((el) => el.id !== element.id)
                .map((el) => ({ id: el.id, x: el.x, y: el.y, width: el.width, height: el.height }));

              const elementBounds: ElementBounds = {
                id: element.id,
                x: newX,
                y: newY,
                width: element.width,
                height: element.height,
              };

              const alignmentGuides = getAlignmentGuides(elementBounds, otherElements);
              setGuides(alignmentGuides);

              if (alignmentGuides.length > 0) {
                const snappedPos = snapToGuides(elementBounds, alignmentGuides);
                updateElement(element.id, { x: snappedPos.x, y: snappedPos.y });
                e.target.position(snappedPos);
              } else {
                updateElement(element.id, { x: newX, y: newY });
              }
            }}
            onDragEnd={() => {
              saveToHistory();
              setGuides([]);
            }}
            onClick={(e) => {
              selectElement(element.id, e.evt.shiftKey);
            }}
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
            {isSelected && (
              <ResizeHandles
                x={0}
                y={0}
                width={element.width}
                height={element.height}
                onResize={(x, y, w, h) => {
                  updateElement(element.id, { width: w, height: h });
                }}
              />
            )}
          </Group>
        );

      case 'image':
        return (
          <Group
            key={element.id}
            x={element.x}
            y={element.y}
            draggable={!element.locked}
            onDragMove={(e) => {
              const newX = e.target.x();
              const newY = e.target.y();
              updateElement(element.id, { x: newX, y: newY });
            }}
            onDragEnd={() => saveToHistory()}
            onClick={(e) => selectElement(element.id, e.evt.shiftKey)}
          >
            <Rect
              width={element.width}
              height={element.height}
              fill={element.fill || '#e5e7eb'}
              stroke={isSelected ? '#3b82f6' : 'transparent'}
              strokeWidth={isSelected ? 2 : 0}
            />
            {images[element.id] && (
              <KonvaImage
                image={images[element.id]}
                width={element.width}
                height={element.height}
              />
            )}
            {isSelected && (
              <ResizeHandles
                x={0}
                y={0}
                width={element.width}
                height={element.height}
                onResize={(x, y, w, h) => {
                  updateElement(element.id, { width: w, height: h });
                }}
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
            onDragMove={(e) => {
              updateElement(element.id, { x: e.target.x(), y: e.target.y() });
            }}
            onDragEnd={() => saveToHistory()}
            onClick={(e) => selectElement(element.id, e.evt.shiftKey)}
          >
            <Rect
              width={element.width}
              height={element.height}
              fill={element.fill || '#3b82f6'}
              stroke={isSelected ? '#3b82f6' : 'transparent'}
              strokeWidth={isSelected ? 2 : 0}
              cornerRadius={element.borderRadius || 0}
            />
            {isSelected && (
              <ResizeHandles
                x={0}
                y={0}
                width={element.width}
                height={element.height}
                onResize={(x, y, w, h) => {
                  updateElement(element.id, { width: w, height: h });
                }}
              />
            )}
          </Group>
        );

      case 'button':
        return (
          <Group
            key={element.id}
            x={element.x}
            y={element.y}
            draggable={!element.locked}
            onDragMove={(e) => {
              updateElement(element.id, { x: e.target.x(), y: e.target.y() });
            }}
            onDragEnd={() => saveToHistory()}
            onClick={(e) => selectElement(element.id, e.evt.shiftKey)}
          >
            <Rect
              width={element.width}
              height={element.height}
              fill={element.fill || '#3b82f6'}
              stroke={isSelected ? '#3b82f6' : 'transparent'}
              strokeWidth={isSelected ? 2 : 0}
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
            {isSelected && (
              <ResizeHandles
                x={0}
                y={0}
                width={element.width}
                height={element.height}
                onResize={(x, y, w, h) => {
                  updateElement(element.id, { width: w, height: h });
                }}
              />
            )}
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
        scale={{ x: zoomLevel, y: zoomLevel }}
        position={{ x: panX, y: panY }}
        onMouseDown={handleStageMouseDown}
        onMouseMove={handleStageMouseMove}
        onMouseUp={handleStageMouseUp}
      >
        <Layer>
          {/* Grid */}
          {showGrid && (
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
            x={ARTBOARD_X}
            y={ARTBOARD_Y}
            width={ARTBOARD_WIDTH}
            height={ARTBOARD_HEIGHT}
            fill="#ffffff"
            stroke="#d1d5db"
            strokeWidth={1}
          />

          {/* Alignment Guides */}
          {guides.map((guide, idx) =>
            guide.type === 'vertical' ? (
              <Line
                key={`guide-${idx}`}
                points={[guide.value, ARTBOARD_Y - 100, guide.value, ARTBOARD_Y + ARTBOARD_HEIGHT + 100]}
                stroke="#ef4444"
                strokeWidth={1}
                dash={[4, 4]}
              />
            ) : (
              <Line
                key={`guide-${idx}`}
                points={[ARTBOARD_X - 100, guide.value, ARTBOARD_X + ARTBOARD_WIDTH + 100, guide.value]}
                stroke="#ef4444"
                strokeWidth={1}
                dash={[4, 4]}
              />
            )
          )}

          {/* Elements */}
          {currentPage.elements.map((element) => renderElement(element))}

          {/* Box Select Rectangle */}
          {boxSelectStart && boxSelectEnd && (
            <Rect
              x={Math.min(boxSelectStart.x, boxSelectEnd.x)}
              y={Math.min(boxSelectStart.y, boxSelectEnd.y)}
              width={Math.abs(boxSelectEnd.x - boxSelectStart.x)}
              height={Math.abs(boxSelectEnd.y - boxSelectStart.y)}
              fill="rgba(59, 130, 246, 0.1)"
              stroke="#3b82f6"
              strokeWidth={1}
              dash={[4, 4]}
            />
          )}
        </Layer>
      </Stage>

      {/* Zoom Controls */}
      <div className="absolute bottom-4 right-4 flex gap-2 bg-white rounded-lg shadow-md p-2">
        <button
          onClick={() => setZoom(Math.max(0.1, zoomLevel - 0.1))}
          className="px-3 py-1 text-sm font-medium border border-slate-200 rounded hover:bg-slate-50"
        >
          −
        </button>
        <div className="px-3 py-1 text-sm font-medium text-slate-600 min-w-12 text-center">
          {Math.round(zoomLevel * 100)}%
        </div>
        <button
          onClick={() => setZoom(Math.min(5, zoomLevel + 0.1))}
          className="px-3 py-1 text-sm font-medium border border-slate-200 rounded hover:bg-slate-50"
        >
          +
        </button>
      </div>

      {/* Keyboard Hints */}
      <div className="absolute top-4 left-4 text-xs text-slate-500 space-y-1">
        <div>Space + Drag: Pan</div>
        <div>Scroll: Zoom</div>
        <div>G: Toggle Grid</div>
        <div>Shift + Click: Multi-select</div>
      </div>
    </div>
  );
}
