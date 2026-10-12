export interface KeyboardShortcutHandler {
  (e: KeyboardEvent): void;
}

export class KeyboardShortcutManager {
  private shortcuts: Map<string, KeyboardShortcutHandler> = new Map();

  register(key: string, handler: KeyboardShortcutHandler) {
    this.shortcuts.set(key, handler);
  }

  unregister(key: string) {
    this.shortcuts.delete(key);
  }

  handle(e: KeyboardEvent) {
    // Build the key string from the event
    const parts: string[] = [];

    if (e.ctrlKey || e.metaKey) parts.push('ctrl');
    if (e.shiftKey) parts.push('shift');
    if (e.altKey) parts.push('alt');

    // Handle special keys
    const specialKeys: { [key: string]: string } = {
      'Delete': 'delete',
      'Backspace': 'backspace',
      'Enter': 'enter',
      'Tab': 'tab',
      'Escape': 'escape',
      ' ': 'space',
      'ArrowUp': 'arrowup',
      'ArrowDown': 'arrowdown',
      'ArrowLeft': 'arrowleft',
      'ArrowRight': 'arrowright',
    };

    if (specialKeys[e.key]) {
      parts.push(specialKeys[e.key]);
    } else if (e.key.length === 1) {
      parts.push(e.key.toLowerCase());
    }

    const keyCombo = parts.join('+');
    const handler = this.shortcuts.get(keyCombo);

    if (handler) {
      handler(e);
    }
  }
}

export const EDITOR_SHORTCUTS = {
  UNDO: 'ctrl+z',
  REDO: 'ctrl+shift+z',
  DELETE: 'delete',
  BACKSPACE: 'backspace',
  DUPLICATE: 'ctrl+d',
  GROUP: 'ctrl+g',
  UNGROUP: 'ctrl+shift+g',
  COPY: 'ctrl+c',
  PASTE: 'ctrl+v',
  CUT: 'ctrl+x',
  SELECT_ALL: 'ctrl+a',
  DESELECT_ALL: 'escape',
  TOGGLE_GRID: 'g',
  ZOOM_IN: 'ctrl+=',
  ZOOM_OUT: 'ctrl+-',
  ZOOM_TO_FIT: 'ctrl+0',
  SAVE: 'ctrl+s',
  FORWARD: 'ctrl+]',
  BACKWARD: 'ctrl+[',
  FORWARD_ALL: 'ctrl+shift+]',
  BACKWARD_ALL: 'ctrl+shift+[',
};
