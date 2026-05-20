'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEditorStore, type PageData } from '@/lib/editor/useEditorStore';
import EditorToolbar from '@/components/admin/editor/EditorToolbar';
import LeftPanel from '@/components/admin/editor/LeftPanel';
import RightPanel from '@/components/admin/editor/RightPanel';
import Canvas from '@/components/admin/editor/Canvas';
import { Toaster } from 'sonner';

export default function EditorPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [pages, setPages] = useState<PageData[]>([]);
  const { setPages: setStorePages, setCurrentPage, currentPage } = useEditorStore();

  useEffect(() => {
    // Load pages from API
    const loadPages = async () => {
      try {
        const response = await fetch('/admin/api/pages');
        if (response.ok) {
          const data = await response.json();
          setPages(data.pages || []);
          setStorePages(data.pages || []);

          // Load first page if available
          if (data.pages && data.pages.length > 0) {
            setCurrentPage(data.pages[0]);
          } else {
            // Create default home page
            const homePage: PageData = {
              id: 'home',
              name: 'Home',
              slug: '/',
              elements: [],
            };
            setCurrentPage(homePage);
            setPages([homePage]);
            setStorePages([homePage]);
          }
        } else if (response.status === 401) {
          // Not authenticated, redirect to login
          router.push('/admin/login');
        }
      } catch (error) {
        console.error('Error loading pages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPages();
  }, [router, setCurrentPage, setStorePages]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Toaster />
      
      {/* Left Panel - Layers & Elements */}
      <LeftPanel />

      {/* Main Editor Area */}
      <div className="flex flex-col flex-1">
        <EditorToolbar />
        <Canvas />
      </div>

      {/* Right Panel - Properties */}
      <RightPanel />
    </div>
  );
}
