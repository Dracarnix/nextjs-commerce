'use client';

import { useEditorStore } from '@/lib/editor/useEditorStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useState, useMemo } from 'react';

export default function RightPanel() {
  const { currentPage, selectedElementIds, updateElement } = useEditorStore();
  const [showColorPicker, setShowColorPicker] = useState(false);

  const selectedElement = useMemo(() => {
    if (selectedElementIds.length !== 1 || !currentPage) return null;
    const findElement = (elements: any[]): any => {
      for (const el of elements) {
        if (el.id === selectedElementIds[0]) return el;
        if (el.children) {
          const found = findElement(el.children);
          if (found) return found;
        }
      }
      return null;
    };
    return findElement(currentPage.elements);
  }, [selectedElementIds, currentPage]);

  if (!selectedElement) {
    return (
      <div className="w-80 border-l border-slate-200 bg-white flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Select an element to edit properties</p>
      </div>
    );
  }

  return (
    <div className="w-80 border-l border-slate-200 bg-white flex flex-col">
      <div className="p-4 border-b border-slate-200">
        <h3 className="font-semibold text-sm text-slate-700 capitalize">
          {selectedElement.type} Properties
        </h3>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Position & Size */}
          <div>
            <h4 className="text-xs font-semibold text-slate-600 uppercase mb-3">Position & Size</h4>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">X</Label>
                  <Input
                    type="number"
                    value={selectedElement.x}
                    onChange={(e) =>
                      updateElement(selectedElement.id, { x: parseFloat(e.target.value) })
                    }
                    className="h-8 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs">Y</Label>
                  <Input
                    type="number"
                    value={selectedElement.y}
                    onChange={(e) =>
                      updateElement(selectedElement.id, { y: parseFloat(e.target.value) })
                    }
                    className="h-8 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Width</Label>
                  <Input
                    type="number"
                    value={selectedElement.width}
                    onChange={(e) =>
                      updateElement(selectedElement.id, { width: parseFloat(e.target.value) })
                    }
                    className="h-8 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs">Height</Label>
                  <Input
                    type="number"
                    value={selectedElement.height}
                    onChange={(e) =>
                      updateElement(selectedElement.id, { height: parseFloat(e.target.value) })
                    }
                    className="h-8 text-sm"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs">Rotation</Label>
                <Input
                  type="number"
                  value={selectedElement.rotation}
                  onChange={(e) =>
                    updateElement(selectedElement.id, { rotation: parseFloat(e.target.value) })
                  }
                  className="h-8 text-sm"
                />
              </div>

              <div>
                <Label className="text-xs">Opacity</Label>
                <Slider
                  value={[selectedElement.opacity || 100]}
                  onValueChange={(value) =>
                    updateElement(selectedElement.id, { opacity: value[0] })
                  }
                  min={0}
                  max={100}
                  step={1}
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Text Properties */}
          {selectedElement.type === 'text' && (
            <div>
              <h4 className="text-xs font-semibold text-slate-600 uppercase mb-3">Text</h4>
              <div className="space-y-2">
                <div>
                  <Label className="text-xs">Content</Label>
                  <Input
                    type="text"
                    value={selectedElement.content || ''}
                    onChange={(e) =>
                      updateElement(selectedElement.id, { content: e.target.value })
                    }
                    className="h-8 text-sm"
                  />
                </div>

                <div>
                  <Label className="text-xs">Font Size</Label>
                  <Input
                    type="number"
                    value={selectedElement.fontSize || 16}
                    onChange={(e) =>
                      updateElement(selectedElement.id, { fontSize: parseFloat(e.target.value) })
                    }
                    className="h-8 text-sm"
                  />
                </div>

                <div>
                  <Label className="text-xs">Font Family</Label>
                  <Select
                    value={selectedElement.fontFamily || 'Arial'}
                    onValueChange={(value) =>
                      updateElement(selectedElement.id, { fontFamily: value })
                    }
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Arial">Arial</SelectItem>
                      <SelectItem value="Georgia">Georgia</SelectItem>
                      <SelectItem value="Courier New">Courier New</SelectItem>
                      <SelectItem value="Verdana">Verdana</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs">Font Weight</Label>
                  <Select
                    value={String(selectedElement.fontWeight || 400)}
                    onValueChange={(value) =>
                      updateElement(selectedElement.id, { fontWeight: parseInt(value) })
                    }
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="400">Normal</SelectItem>
                      <SelectItem value="600">Semi Bold</SelectItem>
                      <SelectItem value="700">Bold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs">Text Align</Label>
                  <Select
                    value={selectedElement.textAlign || 'left'}
                    onValueChange={(value) =>
                      updateElement(selectedElement.id, { textAlign: value })
                    }
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs">Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={selectedElement.color || '#000000'}
                      onChange={(e) =>
                        updateElement(selectedElement.id, { color: e.target.value })
                      }
                      className="h-8 w-12 rounded cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={selectedElement.color || '#000000'}
                      onChange={(e) =>
                        updateElement(selectedElement.id, { color: e.target.value })
                      }
                      className="h-8 text-sm flex-1"
                    />
                  </div>
                </div>
              </div>

              <Separator className="my-4" />
            </div>
          )}

          {/* Image Properties */}
          {selectedElement.type === 'image' && (
            <div>
              <h4 className="text-xs font-semibold text-slate-600 uppercase mb-3">Image</h4>
              <div className="space-y-2">
                <div>
                  <Label className="text-xs">Image URL</Label>
                  <Input
                    type="text"
                    value={selectedElement.src || ''}
                    onChange={(e) =>
                      updateElement(selectedElement.id, { src: e.target.value })
                    }
                    className="h-8 text-sm"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <Label className="text-xs">Alt Text</Label>
                  <Input
                    type="text"
                    value={selectedElement.content || ''}
                    onChange={(e) =>
                      updateElement(selectedElement.id, { content: e.target.value })
                    }
                    className="h-8 text-sm"
                  />
                </div>
              </div>

              <Separator className="my-4" />
            </div>
          )}

          {/* Button & Link Properties */}
          {(selectedElement.type === 'button' || selectedElement.type === 'link') && (
            <div>
              <h4 className="text-xs font-semibold text-slate-600 uppercase mb-3">Link</h4>
              <div className="space-y-2">
                <div>
                  <Label className="text-xs">Label</Label>
                  <Input
                    type="text"
                    value={selectedElement.content || ''}
                    onChange={(e) =>
                      updateElement(selectedElement.id, { content: e.target.value })
                    }
                    className="h-8 text-sm"
                  />
                </div>

                <div>
                  <Label className="text-xs">URL</Label>
                  <Input
                    type="text"
                    value={selectedElement.href || ''}
                    onChange={(e) =>
                      updateElement(selectedElement.id, { href: e.target.value })
                    }
                    className="h-8 text-sm"
                    placeholder="https://..."
                  />
                </div>

                {selectedElement.type === 'button' && (
                  <>
                    <div>
                      <Label className="text-xs">Background Color</Label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={selectedElement.fill || '#3b82f6'}
                          onChange={(e) =>
                            updateElement(selectedElement.id, { fill: e.target.value })
                          }
                          className="h-8 w-12 rounded cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={selectedElement.fill || '#3b82f6'}
                          onChange={(e) =>
                            updateElement(selectedElement.id, { fill: e.target.value })
                          }
                          className="h-8 text-sm flex-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs">Text Color</Label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={selectedElement.color || '#ffffff'}
                          onChange={(e) =>
                            updateElement(selectedElement.id, { color: e.target.value })
                          }
                          className="h-8 w-12 rounded cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={selectedElement.color || '#ffffff'}
                          onChange={(e) =>
                            updateElement(selectedElement.id, { color: e.target.value })
                          }
                          className="h-8 text-sm flex-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs">Border Radius</Label>
                      <Input
                        type="number"
                        value={selectedElement.borderRadius || 4}
                        onChange={(e) =>
                          updateElement(selectedElement.id, {
                            borderRadius: parseFloat(e.target.value),
                          })
                        }
                        className="h-8 text-sm"
                      />
                    </div>
                  </>
                )}
              </div>

              <Separator className="my-4" />
            </div>
          )}

          {/* Shape Properties */}
          {selectedElement.type === 'shape' && (
            <div>
              <h4 className="text-xs font-semibold text-slate-600 uppercase mb-3">Shape</h4>
              <div className="space-y-2">
                <div>
                  <Label className="text-xs">Fill Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={selectedElement.fill || '#3b82f6'}
                      onChange={(e) =>
                        updateElement(selectedElement.id, { fill: e.target.value })
                      }
                      className="h-8 w-12 rounded cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={selectedElement.fill || '#3b82f6'}
                      onChange={(e) =>
                        updateElement(selectedElement.id, { fill: e.target.value })
                      }
                      className="h-8 text-sm flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs">Border Radius</Label>
                  <Input
                    type="number"
                    value={selectedElement.borderRadius || 0}
                    onChange={(e) =>
                      updateElement(selectedElement.id, {
                        borderRadius: parseFloat(e.target.value),
                      })
                    }
                    className="h-8 text-sm"
                  />
                </div>
              </div>

              <Separator className="my-4" />
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
