import { create } from 'zustand';
import type { EditorElement, PageLayout, EditorState as EditorStateType } from './types';
import { v4 as uuidv4 } from 'uuid';

interface EditorStateActions {
  // Page actions
  setCurrentPage: (pageId: string) => void;
  setPages: (pages: PageLayout[]) => void;
  addPage: (name: string, slug: string) => void;
  deletePage: (pageId: string) => void;
  renamePage: (pageId: string, name: string) => void;

  // Element actions
  selectElement: (id: string, multi?: boolean) => void;
  deselectAll: () => void;
  addElement: (element: EditorElement) => void;
  updateElement: (id: string, updates: Partial<EditorElement>) => void;
  deleteElement: (id: string) => void;
  deleteSelectedElements: () => void;
  moveElement: (id: string, x: number, y: number) => void;

  // Canvas actions
  setZoom: (level: number) => void;
  setPan: (x: number, y: number) => void;
  toggleGrid: () => void;

  // Status actions
  setStatus: (status: EditorStateType['status'], error?: string) => void;

  // History actions
  undo: () => void;
  redo: () => void;
  saveToHistory: () => void;
}

type EditorStore = EditorStateType & EditorStateActions;

const defaultState: EditorStateType = {
  pages: [],
  currentPageId: null,
  selectedElementIds: [],
  clipboard: null,
  history: [],
  historyIndex: -1,
  zoomLevel: 1,
  panX: 0,
  panY: 0,
  showGrid: false,
  gridSize: 20,
  status: 'idle',
  error: null,
};

export const useEditorStore = create<EditorStore>((set, get) => ({
  ...defaultState,

  setCurrentPage: (pageId: string) => set({ currentPageId: pageId }),

  setPages: (pages: PageLayout[]) => set({ pages }),

  addPage: (name: string, slug: string) => {
    set((state) => {
      const newPage: PageLayout = {
        id: uuidv4(),
        name,
        slug,
        elements: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      return {
        pages: [...state.pages, newPage],
        currentPageId: newPage.id,
      };
    });
  },

  deletePage: (pageId: string) => {
    set((state) => ({
      pages: state.pages.filter((p) => p.id !== pageId),
      currentPageId: state.currentPageId === pageId ? state.pages[0]?.id || null : state.currentPageId,
    }));
  },

  renamePage: (pageId: string, name: string) => {
    set((state) => ({
      pages: state.pages.map((p) =>
        p.id === pageId ? { ...p, name, updatedAt: Date.now() } : p
      ),
    }));
  },

  selectElement: (id: string, multi = false) => {
    set((state) => ({
      selectedElementIds: multi
        ? state.selectedElementIds.includes(id)
          ? state.selectedElementIds.filter((sid) => sid !== id)
          : [...state.selectedElementIds, id]
        : [id],
    }));
  },

  deselectAll: () => set({ selectedElementIds: [] }),

  addElement: (element: EditorElement) => {
    set((state) => {
      if (!state.currentPageId) return state;
      return {
        pages: state.pages.map((p) =>
          p.id === state.currentPageId
            ? { ...p, elements: [...p.elements, element], updatedAt: Date.now() }
            : p
        ),
      };
    });
  },

  updateElement: (id: string, updates: Partial<EditorElement>) => {
    set((state) => {
      if (!state.currentPageId) return state;
      return {
        pages: state.pages.map((p) =>
          p.id === state.currentPageId
            ? {
                ...p,
                elements: p.elements.map((el) => (el.id === id ? { ...el, ...updates } : el)),
                updatedAt: Date.now(),
              }
            : p
        ),
      };
    });
  },

  deleteElement: (id: string) => {
    set((state) => {
      if (!state.currentPageId) return state;
      return {
        pages: state.pages.map((p) =>
          p.id === state.currentPageId
            ? {
                ...p,
                elements: p.elements.filter((el) => el.id !== id),
                updatedAt: Date.now(),
              }
            : p
        ),
        selectedElementIds: state.selectedElementIds.filter((sid) => sid !== id),
      };
    });
  },

  deleteSelectedElements: () => {
    set((state) => {
      if (!state.currentPageId) return state;
      const idsToDelete = new Set(state.selectedElementIds);
      return {
        pages: state.pages.map((p) =>
          p.id === state.currentPageId
            ? {
                ...p,
                elements: p.elements.filter((el) => !idsToDelete.has(el.id)),
                updatedAt: Date.now(),
              }
            : p
        ),
        selectedElementIds: [],
      };
    });
  },

  moveElement: (id: string, x: number, y: number) => {
    set((state) => {
      if (!state.currentPageId) return state;
      return {
        pages: state.pages.map((p) =>
          p.id === state.currentPageId
            ? {
                ...p,
                elements: p.elements.map((el) =>
                  el.id === id ? { ...el, x, y } : el
                ),
                updatedAt: Date.now(),
              }
            : p
        ),
      };
    });
  },

  setZoom: (level: number) => set({ zoomLevel: Math.max(0.1, Math.min(5, level)) }),

  setPan: (x: number, y: number) => set({ panX: x, panY: y }),

  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),

  setStatus: (status, error) => set({ status, error: error || null }),

  undo: () => {
    set((state) => {
      if (state.historyIndex > 0) {
        const newIndex = state.historyIndex - 1;
        return {
          pages: state.history[newIndex],
          historyIndex: newIndex,
        };
      }
      return state;
    });
  },

  redo: () => {
    set((state) => {
      if (state.historyIndex < state.history.length - 1) {
        const newIndex = state.historyIndex + 1;
        return {
          pages: state.history[newIndex],
          historyIndex: newIndex,
        };
      }
      return state;
    });
  },

  saveToHistory: () => {
    set((state) => {
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(state.pages);
      return {
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  },
}));
