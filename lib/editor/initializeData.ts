import { promises as fs } from 'fs';
import path from 'path';
import type { PageLayout } from './types';
import { v4 as uuidv4 } from 'uuid';

const DATA_DIR = path.join(process.cwd(), 'public', 'editor-data');
const PAGES_FILE = path.join(DATA_DIR, 'pages.json');

export async function ensureDataDirectory() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    console.error('Failed to create data directory:', error);
  }
}

export async function loadPages(): Promise<PageLayout[]> {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(PAGES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // File doesn't exist yet, create default pages
    const defaultPages = getDefaultPages();
    await savePages(defaultPages);
    return defaultPages;
  }
}

export async function savePages(pages: PageLayout[]): Promise<void> {
  try {
    await ensureDataDirectory();
    await fs.writeFile(PAGES_FILE, JSON.stringify(pages, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to save pages:', error);
    throw error;
  }
}

export async function getPage(pageId: string): Promise<PageLayout | null> {
  const pages = await loadPages();
  return pages.find((p) => p.id === pageId) || null;
}

export async function updatePage(pageId: string, page: PageLayout): Promise<void> {
  const pages = await loadPages();
  const index = pages.findIndex((p) => p.id === pageId);

  if (index === -1) {
    throw new Error(`Page with id ${pageId} not found`);
  }

  pages[index] = {
    ...page,
    updatedAt: Date.now(),
  };

  await savePages(pages);
}

export async function createPage(name: string, slug: string): Promise<PageLayout> {
  const pages = await loadPages();

  // Check if slug already exists
  if (pages.some((p) => p.slug === slug)) {
    throw new Error(`Page with slug ${slug} already exists`);
  }

  const newPage: PageLayout = {
    id: uuidv4(),
    name,
    slug,
    elements: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  pages.push(newPage);
  await savePages(pages);

  return newPage;
}

export async function deletePage(pageId: string): Promise<void> {
  const pages = await loadPages();
  const filtered = pages.filter((p) => p.id !== pageId);

  if (filtered.length === pages.length) {
    throw new Error(`Page with id ${pageId} not found`);
  }

  await savePages(filtered);
}

export async function renamePage(pageId: string, newName: string): Promise<void> {
  const pages = await loadPages();
  const page = pages.find((p) => p.id === pageId);

  if (!page) {
    throw new Error(`Page with id ${pageId} not found`);
  }

  page.name = newName;
  page.updatedAt = Date.now();

  await savePages(pages);
}

function getDefaultPages(): PageLayout[] {
  return [
    {
      id: uuidv4(),
      name: 'Home',
      slug: 'home',
      elements: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  ];
}
