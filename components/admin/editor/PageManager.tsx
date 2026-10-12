'use client';

import { useEditorStore } from '@/lib/editor/useEditorStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { ChevronDown, Plus, Edit2, Trash2 } from 'lucide-react';

export default function PageManager() {
  const { pages, currentPageId, setCurrentPage, addPage, updatePage, deletePage } =
    useEditorStore();

  const currentPage = pages.find((p) => p.id === currentPageId);
  const [isAddingPage, setIsAddingPage] = useState(false);
  const [isEditingPage, setIsEditingPage] = useState(false);
  const [editPageId, setEditPageId] = useState<string | null>(null);
  const [pageName, setPageName] = useState('');
  const [pageSlug, setPageSlug] = useState('');

  const handleAddPage = () => {
    if (!pageName.trim() || !pageSlug.trim()) return;

    addPage({
      name: pageName,
      slug: pageSlug,
    });

    setPageName('');
    setPageSlug('');
    setIsAddingPage(false);
  };

  const handleUpdatePage = () => {
    if (!editPageId || !pageName.trim() || !pageSlug.trim()) return;

    updatePage(editPageId, {
      name: pageName,
      slug: pageSlug,
    });

    setPageName('');
    setPageSlug('');
    setEditPageId(null);
    setIsEditingPage(false);
  };

  const handleEditClick = (pageId: string) => {
    const page = pages.find((p) => p.id === pageId);
    if (page) {
      setEditPageId(pageId);
      setPageName(page.name);
      setPageSlug(page.slug);
      setIsEditingPage(true);
    }
  };

  const handleDeletePage = (pageId: string) => {
    if (confirm('Are you sure you want to delete this page?')) {
      deletePage(pageId);
    }
  };

  const handleGenerateSlug = (name: string) => {
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    setPageSlug(slug);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="gap-2"
            disabled={!currentPage}
          >
            <span className="truncate max-w-xs">{currentPage?.name || 'Select Page'}</span>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          {pages.map((page) => (
            <DropdownMenuItem
              key={page.id}
              onClick={() => setCurrentPage(page.id)}
              className="justify-between"
            >
              <span>{page.name}</span>
              {currentPageId === page.id && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                  Current
                </span>
              )}
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator />

          <Dialog open={isAddingPage} onOpenChange={setIsAddingPage}>
            <DialogTrigger asChild>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Page
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Page</DialogTitle>
                <DialogDescription>
                  Add a new page to your website
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div>
                  <label className="text-sm font-medium">Page Name</label>
                  <Input
                    value={pageName}
                    onChange={(e) => {
                      setPageName(e.target.value);
                      handleGenerateSlug(e.target.value);
                    }}
                    placeholder="Home"
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Page Slug (URL)</label>
                  <Input
                    value={pageSlug}
                    onChange={(e) => setPageSlug(e.target.value)}
                    placeholder="home"
                    className="mt-1"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    URL: /editor/{pageSlug}
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddingPage(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddPage}>Create Page</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {pages.length > 0 && <DropdownMenuSeparator />}

          {pages.map((page) => (
            <div
              key={page.id}
              className="px-2 py-1.5 hover:bg-slate-100 rounded text-sm flex items-center gap-1 group"
            >
              <span className="flex-1 truncate text-xs">{page.slug}</span>
              <Dialog open={isEditingPage && editPageId === page.id} onOpenChange={setIsEditingPage}>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-6 h-6 p-0 opacity-0 group-hover:opacity-100"
                    onClick={() => handleEditClick(page.id)}
                  >
                    <Edit2 className="w-3 h-3" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Page</DialogTitle>
                    <DialogDescription>
                      Update page details
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    <div>
                      <label className="text-sm font-medium">Page Name</label>
                      <Input
                        value={pageName}
                        onChange={(e) => setPageName(e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Page Slug (URL)</label>
                      <Input
                        value={pageSlug}
                        onChange={(e) => setPageSlug(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditingPage(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleUpdatePage}>Update Page</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button
                size="sm"
                variant="ghost"
                className="w-6 h-6 p-0 opacity-0 group-hover:opacity-100 text-red-600 hover:bg-red-50"
                onClick={() => handleDeletePage(page.id)}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
