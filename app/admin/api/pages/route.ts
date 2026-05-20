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
    // File doesn't exist yet, return default
    return {
      pages: [
        {
          id: 'home',
          name: 'Home',
          slug: '/',
          elements: [],
        },
      ],
    };
  }
}

async function writePages(data: { pages: PageData[] }) {
  await ensureDataDir();
  await fs.writeFile(PAGES_FILE, JSON.stringify(data, null, 2));
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await readPages();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading pages:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, slug } = await request.json();

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const data = await readPages();
    const newPage: PageData = {
      id: slug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      name,
      slug,
      elements: [],
    };

    // Check for duplicate slug
    if (data.pages.some((p) => p.slug === slug)) {
      return NextResponse.json(
        { error: 'Slug already exists' },
        { status: 400 }
      );
    }

    data.pages.push(newPage);
    await writePages(data);

    return NextResponse.json(newPage, { status: 201 });
  } catch (error) {
    console.error('Error creating page:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
