import { create } from 'zustand';

export interface CanvasElement {
  id: string;
  type: 'text' | 'image' | 'button' | 'link' | 'shape' | 'frame' | 'navbar' | 'spacer';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  zIndex: number;
  locked: boolean;
  hidden: boolean;

  // Content
  content?: string;
  href?: string;
  src?: string;

  // Styling
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  borderRadius?: number;

  // Text-specific
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: number;
  lineHeight?: number;
  letterSpacing?: number;
  color?: string;
  textAlign?: string;

  children?: CanvasElement[];
}

export interface PageData {
  id: string;
  name: string;
  slug: string;
  elements: CanvasElement[];
}

interface EditorState {
  currentPage: PageData | null;
  pages: PageData[];
  selectedElementIds: string[];
  scale: number;
  offsetX: number;
  offsetY: number;
  gridVisible: boolean;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  publishStatus: 'idle' | 'publishing' | 'published' | 'error';
  lastError?: string;

  // Actions
  setCurrentPage: (page: PageData) => void;
  setPages: (pages: PageData[]) => void;
  addPage: (page: PageData) => void;
  deletePage: (pageId: string) => void;
  updatePage: (pageId: string, updates: Partial<PageData>) => void;

  selectElement: (id: string, multi?: boolean) => void;
  deselectAll: () => void;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  deleteElement: (id: string) => void;
  addElement: (element: CanvasElement) => void;

  setScale: (scale: number) => void;
  setOffset: (x: number, y: number) => void;
  toggleGrid: () => void;

  setSaveStatus: (status: 'idle' | 'saving' | 'saved' | 'error', error?: string) => void;
  setPublishStatus: (status: 'idle' | 'publishing' | 'published' | 'error', error?: string) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  currentPage: null,
  pages: [],
  selectedElementIds: [],
  scale: 1,
  offsetX: 0,
  offsetY: 0,
  gridVisible: false,
  saveStatus: 'idle',
  publishStatus: 'idle',

  setCurrentPage: (page) => set({ currentPage: page }),
  
  setPages: (pages) => set({ pages }),
  
  addPage: (page) =>
    set((state) => ({
      pages: [...state.pages, page],
    })),
  
  deletePage: (pageId) =>
    set((state) => ({
      pages: state.pages.filter((p) => p.id !== pageId),
      currentPage: state.currentPage?.id === pageId ? null : state.currentPage,
    })),
  
  updatePage: (pageId, updates) =>
    set((state) => ({
      currentPage: state.currentPage?.id === pageId 
        ? { ...state.currentPage, ...updates }
        : state.currentPage,
      pages: state.pages.map((p) =>
        p.id === pageId ? { ...p, ...updates } : p
      ),
    })),

  selectElement: (id, multi = false) =>
    set((state) => ({
      selectedElementIds: multi
        ? state.selectedElementIds.includes(id)
          ? state.selectedElementIds.filter((sid) => sid !== id)
          : [...state.selectedElementIds, id]
        : [id],
    })),

  deselectAll: () => set({ selectedElementIds: [] }),

  updateElement: (id, updates) =>
    set((state) => {
      if (!state.currentPage) return state;
      
      const updateRecursive = (elements: CanvasElement[]): CanvasElement[] =>
        elements.map((el) => {
          if (el.id === id) {
            return { ...el, ...updates };
          }
          if (el.children) {
            return {
              ...el,
              children: updateRecursive(el.children),
            };
          }
          return el;
        });

      return {
        currentPage: {
          ...state.currentPage,
          elements: updateRecursive(state.currentPage.elements),
        },
      };
    }),

  deleteElement: (id) =>
    set((state) => {
      if (!state.currentPage) return state;

      const deleteRecursive = (elements: CanvasElement[]): CanvasElement[] =>
        elements
          .filter((el) => el.id !== id)
          .map((el) => ({
            ...el,
            children: el.children ? deleteRecursive(el.children) : undefined,
          }));

      return {
        currentPage: {
          ...state.currentPage,
          elements: deleteRecursive(state.currentPage.elements),
        },
        selectedElementIds: state.selectedElementIds.filter((sid) => sid !== id),
      };
    }),

  addElement: (element) =>
    set((state) => {
      if (!state.currentPage) return state;
      
      return {
        currentPage: {
          ...state.currentPage,
          elements: [...state.currentPage.elements, element],
        },
      };
    }),

  setScale: (scale) => set({ scale }),
  
  setOffset: (x, y) => set({ offsetX: x, offsetY: y }),
  
  toggleGrid: () => set((state) => ({ gridVisible: !state.gridVisible })),

  setSaveStatus: (status, error) =>
    set({ saveStatus: status, lastError: error }),
  
  setPublishStatus: (status, error) =>
    set({ publishStatus: status, lastError: error }),
}));
