'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import { EDITOR_SHORTCUTS } from '@/lib/editor/keyboardShortcuts';

const SHORTCUTS_DISPLAY = [
  { category: 'Editing', shortcuts: [
    { name: 'Undo', key: EDITOR_SHORTCUTS.UNDO },
    { name: 'Redo', key: EDITOR_SHORTCUTS.REDO },
    { name: 'Duplicate', key: EDITOR_SHORTCUTS.DUPLICATE },
    { name: 'Copy', key: EDITOR_SHORTCUTS.COPY },
    { name: 'Paste', key: EDITOR_SHORTCUTS.PASTE },
    { name: 'Cut', key: EDITOR_SHORTCUTS.CUT },
  ]},
  { category: 'Selection', shortcuts: [
    { name: 'Select All', key: EDITOR_SHORTCUTS.SELECT_ALL },
    { name: 'Deselect All', key: EDITOR_SHORTCUTS.DESELECT_ALL },
    { name: 'Delete', key: EDITOR_SHORTCUTS.DELETE },
  ]},
  { category: 'Layering', shortcuts: [
    { name: 'Bring Forward', key: EDITOR_SHORTCUTS.FORWARD },
    { name: 'Send Backward', key: EDITOR_SHORTCUTS.BACKWARD },
    { name: 'Bring to Front', key: EDITOR_SHORTCUTS.FORWARD_ALL },
    { name: 'Send to Back', key: EDITOR_SHORTCUTS.BACKWARD_ALL },
  ]},
  { category: 'View', shortcuts: [
    { name: 'Toggle Grid', key: EDITOR_SHORTCUTS.TOGGLE_GRID },
    { name: 'Zoom In', key: EDITOR_SHORTCUTS.ZOOM_IN },
    { name: 'Zoom Out', key: EDITOR_SHORTCUTS.ZOOM_OUT },
  ]},
  { category: 'File', shortcuts: [
    { name: 'Save', key: EDITOR_SHORTCUTS.SAVE },
  ]},
];

export default function KeyboardShortcutsDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <HelpCircle className="w-4 h-4" />
          Shortcuts
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Quick reference for editor shortcuts
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {SHORTCUTS_DISPLAY.map((group) => (
            <div key={group.category}>
              <h3 className="font-semibold text-sm mb-3 text-slate-700">
                {group.category}
              </h3>
              <div className="space-y-2">
                {group.shortcuts.map((shortcut) => (
                  <div
                    key={shortcut.name}
                    className="flex items-center justify-between p-2 rounded hover:bg-slate-50"
                  >
                    <span className="text-sm text-slate-600">
                      {shortcut.name}
                    </span>
                    <kbd className="px-2 py-1 text-xs font-semibold text-slate-800 bg-slate-100 border border-slate-300 rounded">
                      {shortcut.key.toUpperCase()}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
