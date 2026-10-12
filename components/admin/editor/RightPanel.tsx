'use client';

import { useEditorStore } from '@/lib/editor/useEditorStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useMemo } from 'react';
import {
  NumberInput,
  SliderInput,
  ColorInput,
  SelectInput,
  TextInput,
} from './PropertyInputs';

export default function RightPanel() {
  const { currentPage, selectedElementIds, updateElement } = useEditorStore();

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
        <div className="p-4 space-y-6">
          {/* Position & Size */}
          <div>
            <h4 className="text-xs font-semibold text-slate-600 uppercase mb-3">Position & Size</h4>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <NumberInput
                  label="X"
                  value={selectedElement.x || 0}
                  onChange={(val) => updateElement(selectedElement.id, { x: val })}
                />
                <NumberInput
                  label="Y"
                  value={selectedElement.y || 0}
                  onChange={(val) => updateElement(selectedElement.id, { y: val })}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <NumberInput
                  label="Width"
                  value={selectedElement.width || 100}
                  onChange={(val) => updateElement(selectedElement.id, { width: val })}
                  min={1}
                />
                <NumberInput
                  label="Height"
                  value={selectedElement.height || 100}
                  onChange={(val) => updateElement(selectedElement.id, { height: val })}
                  min={1}
                />
              </div>

              <NumberInput
                label="Rotation"
                value={selectedElement.rotation || 0}
                onChange={(val) => updateElement(selectedElement.id, { rotation: val })}
              />

              <SliderInput
                label="Opacity"
                value={selectedElement.opacity || 100}
                onChange={(val) => updateElement(selectedElement.id, { opacity: val })}
                min={0}
                max={100}
              />
            </div>
          </div>

          <Separator />

          {/* Text Properties */}
          {selectedElement.type === 'text' && (
            <div>
              <h4 className="text-xs font-semibold text-slate-600 uppercase mb-3">Text Settings</h4>
              <div className="space-y-3">
                <TextInput
                  label="Content"
                  value={selectedElement.content || ''}
                  onChange={(val) => updateElement(selectedElement.id, { content: val })}
                  multiline
                />

                <div className="grid grid-cols-2 gap-2">
                  <NumberInput
                    label="Font Size"
                    value={selectedElement.fontSize || 16}
                    onChange={(val) => updateElement(selectedElement.id, { fontSize: val })}
                    min={8}
                    max={72}
                  />
                  <NumberInput
                    label="Line Height"
                    value={selectedElement.lineHeight || 1.5}
                    onChange={(val) => updateElement(selectedElement.id, { lineHeight: val })}
                    step={0.1}
                  />
                </div>

                <SelectInput
                  label="Font Family"
                  value={selectedElement.fontFamily || 'Arial'}
                  onChange={(val) => updateElement(selectedElement.id, { fontFamily: val })}
                  options={[
                    { value: 'Arial', label: 'Arial' },
                    { value: 'Georgia', label: 'Georgia' },
                    { value: 'Courier New', label: 'Courier New' },
                    { value: 'Verdana', label: 'Verdana' },
                    { value: 'Trebuchet MS', label: 'Trebuchet MS' },
                    { value: 'Times New Roman', label: 'Times New Roman' },
                  ]}
                />

                <SelectInput
                  label="Font Weight"
                  value={String(selectedElement.fontWeight || 400)}
                  onChange={(val) =>
                    updateElement(selectedElement.id, { fontWeight: parseInt(val) })
                  }
                  options={[
                    { value: '300', label: 'Light' },
                    { value: '400', label: 'Normal' },
                    { value: '600', label: 'Semi Bold' },
                    { value: '700', label: 'Bold' },
                    { value: '800', label: 'Extra Bold' },
                  ]}
                />

                <SelectInput
                  label="Text Align"
                  value={selectedElement.textAlign || 'left'}
                  onChange={(val) => updateElement(selectedElement.id, { textAlign: val })}
                  options={[
                    { value: 'left', label: 'Left' },
                    { value: 'center', label: 'Center' },
                    { value: 'right', label: 'Right' },
                    { value: 'justify', label: 'Justify' },
                  ]}
                />

                <ColorInput
                  label="Text Color"
                  value={selectedElement.color || '#000000'}
                  onChange={(val) => updateElement(selectedElement.id, { color: val })}
                />

                <NumberInput
                  label="Letter Spacing"
                  value={selectedElement.letterSpacing || 0}
                  onChange={(val) => updateElement(selectedElement.id, { letterSpacing: val })}
                  step={0.1}
                />
              </div>
              <Separator className="my-4" />
            </div>
          )}

          {/* Image Properties */}
          {selectedElement.type === 'image' && (
            <div>
              <h4 className="text-xs font-semibold text-slate-600 uppercase mb-3">Image Settings</h4>
              <div className="space-y-3">
                <TextInput
                  label="Image URL"
                  value={selectedElement.src || ''}
                  onChange={(val) => updateElement(selectedElement.id, { src: val })}
                  placeholder="https://..."
                />

                <TextInput
                  label="Alt Text"
                  value={selectedElement.content || ''}
                  onChange={(val) => updateElement(selectedElement.id, { content: val })}
                />

                <SelectInput
                  label="Object Fit"
                  value={selectedElement.objectFit || 'cover'}
                  onChange={(val) => updateElement(selectedElement.id, { objectFit: val })}
                  options={[
                    { value: 'cover', label: 'Cover' },
                    { value: 'contain', label: 'Contain' },
                    { value: 'fill', label: 'Fill' },
                    { value: 'scale-down', label: 'Scale Down' },
                  ]}
                />
              </div>
              <Separator className="my-4" />
            </div>
          )}

          {/* Button Properties */}
          {selectedElement.type === 'button' && (
            <div>
              <h4 className="text-xs font-semibold text-slate-600 uppercase mb-3">Button Settings</h4>
              <div className="space-y-3">
                <TextInput
                  label="Label"
                  value={selectedElement.content || ''}
                  onChange={(val) => updateElement(selectedElement.id, { content: val })}
                />

                <TextInput
                  label="Link URL"
                  value={selectedElement.href || ''}
                  onChange={(val) => updateElement(selectedElement.id, { href: val })}
                  placeholder="https://..."
                />

                <ColorInput
                  label="Background Color"
                  value={selectedElement.fill || '#3b82f6'}
                  onChange={(val) => updateElement(selectedElement.id, { fill: val })}
                />

                <ColorInput
                  label="Text Color"
                  value={selectedElement.color || '#ffffff'}
                  onChange={(val) => updateElement(selectedElement.id, { color: val })}
                />

                <NumberInput
                  label="Border Radius"
                  value={selectedElement.borderRadius || 4}
                  onChange={(val) => updateElement(selectedElement.id, { borderRadius: val })}
                  min={0}
                />

                <NumberInput
                  label="Border Width"
                  value={selectedElement.borderWidth || 0}
                  onChange={(val) => updateElement(selectedElement.id, { borderWidth: val })}
                  min={0}
                />

                {selectedElement.borderWidth > 0 && (
                  <ColorInput
                    label="Border Color"
                    value={selectedElement.borderColor || '#000000'}
                    onChange={(val) => updateElement(selectedElement.id, { borderColor: val })}
                  />
                )}
              </div>
              <Separator className="my-4" />
            </div>
          )}

          {/* Link Properties */}
          {selectedElement.type === 'link' && (
            <div>
              <h4 className="text-xs font-semibold text-slate-600 uppercase mb-3">Link Settings</h4>
              <div className="space-y-3">
                <TextInput
                  label="Link Text"
                  value={selectedElement.content || ''}
                  onChange={(val) => updateElement(selectedElement.id, { content: val })}
                />

                <TextInput
                  label="URL"
                  value={selectedElement.href || ''}
                  onChange={(val) => updateElement(selectedElement.id, { href: val })}
                  placeholder="https://..."
                />

                <ColorInput
                  label="Link Color"
                  value={selectedElement.color || '#0066cc'}
                  onChange={(val) => updateElement(selectedElement.id, { color: val })}
                />

                <SelectInput
                  label="Decoration"
                  value={selectedElement.textDecoration || 'underline'}
                  onChange={(val) => updateElement(selectedElement.id, { textDecoration: val })}
                  options={[
                    { value: 'none', label: 'None' },
                    { value: 'underline', label: 'Underline' },
                    { value: 'overline', label: 'Overline' },
                    { value: 'line-through', label: 'Strike Through' },
                  ]}
                />
              </div>
              <Separator className="my-4" />
            </div>
          )}

          {/* Shape Properties */}
          {selectedElement.type === 'shape' && (
            <div>
              <h4 className="text-xs font-semibold text-slate-600 uppercase mb-3">Shape Settings</h4>
              <div className="space-y-3">
                <ColorInput
                  label="Fill Color"
                  value={selectedElement.fill || '#3b82f6'}
                  onChange={(val) => updateElement(selectedElement.id, { fill: val })}
                />

                <NumberInput
                  label="Border Radius"
                  value={selectedElement.borderRadius || 0}
                  onChange={(val) => updateElement(selectedElement.id, { borderRadius: val })}
                  min={0}
                />

                <NumberInput
                  label="Border Width"
                  value={selectedElement.borderWidth || 0}
                  onChange={(val) => updateElement(selectedElement.id, { borderWidth: val })}
                  min={0}
                />

                {selectedElement.borderWidth > 0 && (
                  <ColorInput
                    label="Border Color"
                    value={selectedElement.borderColor || '#000000'}
                    onChange={(val) => updateElement(selectedElement.id, { borderColor: val })}
                  />
                )}
              </div>
              <Separator className="my-4" />
            </div>
          )}

          {/* Frame/Container Properties */}
          {selectedElement.type === 'frame' && (
            <div>
              <h4 className="text-xs font-semibold text-slate-600 uppercase mb-3">Frame Settings</h4>
              <div className="space-y-3">
                <ColorInput
                  label="Background Color"
                  value={selectedElement.fill || '#ffffff'}
                  onChange={(val) => updateElement(selectedElement.id, { fill: val })}
                />

                <NumberInput
                  label="Padding"
                  value={selectedElement.padding || 0}
                  onChange={(val) => updateElement(selectedElement.id, { padding: val })}
                  min={0}
                />
              </div>
              <Separator className="my-4" />
            </div>
          )}

          {/* Z Index */}
          <div>
            <h4 className="text-xs font-semibold text-slate-600 uppercase mb-3">Layering</h4>
            <NumberInput
              label="Z Index"
              value={selectedElement.zIndex || 0}
              onChange={(val) => updateElement(selectedElement.id, { zIndex: val })}
            />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
