'use client';

import { useEffect } from 'react';
import { useEditorStore } from '@/lib/editor/useEditorStore';
import { EDITOR_SHORTCUTS, KeyboardShortcutManager } from '@/lib/editor/keyboardShortcuts';

export default function KeyboardShortcutsHandler() {
  const {
    selectedElementIds,
    deleteElement,
    undo,
    redo,
    selectAllElements,
    deselectAllElements,
    toggleGrid,
    showGrid,
    updateElement,
    currentPage,
  } = useEditorStore();

  useEffect(() => {
    const manager = new KeyboardShortcutManager();

    // Register shortcuts
    manager.register(EDITOR_SHORTCUTS.UNDO, (e) => {
      e.preventDefault();
      undo();
    });

    manager.register(EDITOR_SHORTCUTS.REDO, (e) => {
      e.preventDefault();
      redo();
    });

    manager.register(EDITOR_SHORTCUTS.DELETE, (e) => {
      // Only delete if not typing in an input
      if (
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        selectedElementIds.forEach((id) => deleteElement(id));
      }
    });

    manager.register(EDITOR_SHORTCUTS.BACKSPACE, (e) => {
      if (
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        selectedElementIds.forEach((id) => deleteElement(id));
      }
    });

    manager.register(EDITOR_SHORTCUTS.SELECT_ALL, (e) => {
      if (
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        selectAllElements();
      }
    });

    manager.register(EDITOR_SHORTCUTS.DESELECT_ALL, (e) => {
      deselectAllElements();
    });

    manager.register(EDITOR_SHORTCUTS.TOGGLE_GRID, (e) => {
      if (
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        toggleGrid();
      }
    });

    manager.register(EDITOR_SHORTCUTS.DUPLICATE, (e) => {
      if (
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        // Duplicate selected elements
        if (currentPage) {
          selectedElementIds.forEach((id) => {
            const element = currentPage.elements.find((el) => el.id === id);
            if (element) {
              const duplicate = JSON.parse(JSON.stringify(element));
              duplicate.id = `${element.id}-copy-${Date.now()}`;
              duplicate.x += 20;
              duplicate.y += 20;
              // Would need addElement function
            }
          });
        }
      }
    });

    manager.register(EDITOR_SHORTCUTS.FORWARD, (e) => {
      if (
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        selectedElementIds.forEach((id) => {
          const element = currentPage?.elements.find((el) => el.id === id);
          if (element) {
            const currentZ = element.zIndex || 0;
            updateElement(id, { zIndex: currentZ + 1 });
          }
        });
      }
    });

    manager.register(EDITOR_SHORTCUTS.BACKWARD, (e) => {
      if (
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        selectedElementIds.forEach((id) => {
          const element = currentPage?.elements.find((el) => el.id === id);
          if (element) {
            const currentZ = element.zIndex || 0;
            updateElement(id, { zIndex: Math.max(0, currentZ - 1) });
          }
        });
      }
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      manager.handle(e);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    selectedElementIds,
    deleteElement,
    undo,
    redo,
    selectAllElements,
    deselectAllElements,
    toggleGrid,
    updateElement,
    currentPage,
  ]);

  return null;
}
