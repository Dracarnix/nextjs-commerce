import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getPage, updatePage, deletePage, loadPages } from '@/lib/editor/initializeData';
import type { PageLayout } from '@/lib/editor/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const page = await getPage(params.id);

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

    const updatedPage: PageLayout = await request.json();
    
    const existingPage = await getPage(params.id);
    if (!existingPage) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // Preserve id, slug, and createdAt
    const pageToSave: PageLayout = {
      ...updatedPage,
      id: params.id,
      createdAt: existingPage.createdAt,
      updatedAt: Date.now(),
    };

    await updatePage(params.id, pageToSave);
    return NextResponse.json(pageToSave);
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

    await deletePage(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    console.error('Error deleting page:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
