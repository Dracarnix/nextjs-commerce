'use client';

import { useState } from 'react';
import { useEditorStore, type CanvasElement } from '@/lib/editor/useEditorStore';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Type,
  Image as ImageIcon,
  Square,
  Link2,
  Boxes,
  Minus,
  Navigation,
  Plus,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const ELEMENT_TYPES = [
  { id: 'text', label: 'Text', icon: Type },
  { id: 'image', label: 'Image', icon: ImageIcon },
  { id: 'button', label: 'Button', icon: Square },
  { id: 'link', label: 'Link', icon: Link2 },
  { id: 'shape', label: 'Shape', icon: Boxes },
  { id: 'spacer', label: 'Spacer', icon: Minus },
  { id: 'navbar', label: 'Nav Bar', icon: Navigation },
  { id: 'frame', label: 'Frame', icon: Plus },
];

export default function LeftPanel() {
  const {
    currentPage,
    addElement,
    updateElement,
    deleteElement,
    selectElement,
    selectedElementIds,
  } = useEditorStore();

  const [expandedLayers, setExpandedLayers] = useState<string[]>([]);

  const handleAddElement = (type: string) => {
    if (!currentPage) return;

    const newElement: CanvasElement = {
      id: uuidv4(),
      type: type as CanvasElement['type'],
      x: 100,
      y: 100,
      width: type === 'button' ? 120 : type === 'spacer' ? 50 : 200,
      height: type === 'button' ? 40 : type === 'spacer' ? 20 : 100,
      rotation: 0,
      opacity: 100,
      zIndex: currentPage.elements.length,
      locked: false,
      hidden: false,
      content: type === 'text' ? 'Sample text' : type === 'button' ? 'Click me' : type === 'link' ? 'Link' : undefined,
    };

    addElement(newElement);
    selectElement(newElement.id);
  };

  const toggleLayerExpanded = (id: string) => {
    setExpandedLayers((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const renderLayerItem = (element: CanvasElement, depth = 0): React.ReactNode => {
    const isSelected = selectedElementIds.includes(element.id);
    const isExpanded = expandedLayers.includes(element.id);
    const hasChildren = element.children && element.children.length > 0;

    return (
      <div key={element.id}>
        <div
          className={`flex items-center gap-1 px-2 py-1.5 cursor-pointer rounded text-sm ${
            isSelected ? 'bg-blue-50' : 'hover:bg-slate-50'
          }`}
          onClick={() => selectElement(element.id)}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleLayerExpanded(element.id);
              }}
              className="p-0 hover:bg-slate-200 rounded"
            >
              <svg
                className={`w-4 h-4 transition-transform ${
                  isExpanded ? 'rotate-90' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
          {!hasChildren && <div className="w-4" />}

          <span className="flex-1 truncate font-medium">
            {element.content || element.type}
          </span>

          <div className="flex gap-0.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                updateElement(element.id, { hidden: !element.hidden });
              }}
              className="p-1 hover:bg-slate-200 rounded"
            >
              {element.hidden ? (
                <EyeOff className="w-3.5 h-3.5" />
              ) : (
                <Eye className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                updateElement(element.id, { locked: !element.locked });
              }}
              className="p-1 hover:bg-slate-200 rounded"
            >
              {element.locked ? (
                <Lock className="w-3.5 h-3.5" />
              ) : (
                <Unlock className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteElement(element.id);
              }}
              className="p-1 hover:bg-red-100 text-red-600 rounded"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div>
            {element.children!.map((child) => renderLayerItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 border-r border-slate-200 bg-white flex flex-col">
      <Tabs defaultValue="layers" className="flex-1 flex flex-col">
        <TabsList className="w-full rounded-none border-b">
          <TabsTrigger value="layers" className="flex-1">
            Layers
          </TabsTrigger>
          <TabsTrigger value="elements" className="flex-1">
            Elements
          </TabsTrigger>
        </TabsList>

        <TabsContent value="layers" className="flex-1">
          {currentPage && currentPage.elements.length > 0 ? (
            <ScrollArea className="h-full">
              <div className="p-2">
                {currentPage.elements.map((element) =>
                  renderLayerItem(element)
                )}
              </div>
            </ScrollArea>
          ) : (
            <div className="p-4 text-center text-muted-foreground text-sm">
              No elements yet. Add one from the Elements tab.
            </div>
          )}
        </TabsContent>

        <TabsContent value="elements" className="flex-1">
          <ScrollArea className="h-full">
            <div className="p-3 space-y-2">
              {ELEMENT_TYPES.map((elementType) => {
                const Icon = elementType.icon;
                return (
                  <Button
                    key={elementType.id}
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={() => handleAddElement(elementType.id)}
                  >
                    <Icon className="w-4 h-4" />
                    {elementType.label}
                  </Button>
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
