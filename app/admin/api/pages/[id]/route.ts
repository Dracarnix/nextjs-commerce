import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import fs from 'fs/promises';
import path from 'path';
import { PageData } from '@/lib/editor/useEditorStore';

const DATA_DIR = path.join(process.cwd(), 'public', 'editor-data');
const PAGES_FILE = path.join(DATA_DIR, 'pages.json');

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating data directory:', error);
  }
}

async function readPages(): Promise<{ pages: PageData[] }> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(PAGES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return { pages: [] };
  }
}

async function writePages(data: { pages: PageData[] }) {
  await ensureDataDir();
  await fs.writeFile(PAGES_FILE, JSON.stringify(data, null, 2));
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await readPages();
    const page = data.pages.find((p) => p.id === params.id);

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json(page);
  } catch (error) {
    console.error('Error reading page:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updatedPage: PageData = await request.json();
    const data = await readPages();
    const index = data.pages.findIndex((p) => p.id === params.id);

    if (index === -1) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    data.pages[index] = updatedPage;
    await writePages(data);

    return NextResponse.json(updatedPage);
  } catch (error) {
    console.error('Error updating page:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await readPages();
    data.pages = data.pages.filter((p) => p.id !== params.id);
    await writePages(data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting page:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
