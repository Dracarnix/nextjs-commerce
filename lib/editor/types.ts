export type ElementType = 'text' | 'rectangle' | 'image' | 'button' | 'frame' | 'link' | 'shape' | 'navbar' | 'spacer';

export interface EditorElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string; // For text, buttons, links
  src?: string; // For images
  href?: string; // For links and buttons
  color?: string; // Text color
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
  textAlign?: 'left' | 'center' | 'right';
  opacity?: number;
  locked?: boolean;
  hidden?: boolean;
  zIndex?: number;
  rotation?: number;
  scaleX?: number;
  scaleY?: number;
}

export interface PageLayout {
  id: string;
  name: string;
  slug: string;
  elements: EditorElement[];
  createdAt: number;
  updatedAt: number;
}

export interface EditorState {
  pages: PageLayout[];
  currentPageId: string | null;
  selectedElementIds: string[];
  clipboard: EditorElement | null;
  history: PageLayout[][];
  historyIndex: number;
  zoomLevel: number;
  panX: number;
  panY: number;
  showGrid: boolean;
  gridSize: number;
  status: 'idle' | 'saving' | 'saved' | 'publishing' | 'published' | 'error';
  error: string | null;
}
