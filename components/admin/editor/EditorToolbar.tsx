'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useEditorStore, type PageData } from '@/lib/editor/useEditorStore';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogOut, Plus, Save, Zap } from 'lucide-react';
import { toast } from 'sonner';
import PageManager from './PageManager';
import AdminHelp from './AdminHelp';

export default function EditorToolbar() {
  const router = useRouter();
  const {
    pages,
    currentPage,
    setSaveStatus,
    setPublishStatus,
    saveStatus,
    publishStatus,
  } = useEditorStore();

  const [isConfirmingLogout, setIsConfirmingLogout] = useState(false);

  const handleSaveDraft = async () => {
    if (!currentPage) return;

    setSaveStatus('saving');
    try {
      const response = await fetch(`/admin/api/pages/${currentPage.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentPage),
      });

      if (response.ok) {
        setSaveStatus('saved');
        toast.success('Draft saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        setSaveStatus('error', 'Failed to save');
        toast.error('Failed to save draft');
      }
    } catch (error) {
      setSaveStatus('error', String(error));
      toast.error('Failed to save draft');
    }
  };

  const handlePublish = async () => {
    if (!currentPage) return;

    setPublishStatus('publishing');
    try {
      // First save the current page
      await fetch(`/admin/api/pages/${currentPage.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentPage),
      });

      // Then publish to GitHub
      const response = await fetch('/admin/api/github/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pages }),
      });

      if (response.ok) {
        setPublishStatus('published');
        toast.success('Published to GitHub and Vercel!');
        setTimeout(() => setPublishStatus('idle'), 3000);
      } else {
        const data = await response.json();
        setPublishStatus('error', data.error || 'Failed to publish');
        toast.error('Failed to publish');
      }
    } catch (error) {
      setPublishStatus('error', String(error));
      toast.error('Failed to publish');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/admin/api/auth/logout', {
        method: 'POST',
      });
      router.push('/');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const getStatusColor = () => {
    if (saveStatus === 'saved') return 'text-green-600';
    if (saveStatus === 'saving') return 'text-blue-600';
    if (saveStatus === 'error') return 'text-red-600';
    return 'text-muted-foreground';
  };

  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="flex items-center justify-between h-16 px-6 gap-4">
        {/* Left Section - Page Manager */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-slate-600">Pages:</span>
          <PageManager />
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-4">
          <AdminHelp />
          
          <div className={`text-xs font-medium ${getStatusColor()}`}>
            {saveStatus === 'saving' && 'Saving...'}
            {saveStatus === 'saved' && 'Draft Saved'}
            {saveStatus === 'error' && 'Save Error'}
            {publishStatus === 'publishing' && 'Publishing...'}
            {publishStatus === 'published' && 'Published!'}
            {publishStatus === 'error' && 'Publish Error'}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveDraft}
            disabled={saveStatus === 'saving'}
            className="gap-2"
          >
            <Save className="w-4 h-4" />
            Save Draft
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={handlePublish}
            disabled={publishStatus === 'publishing'}
            className="gap-2"
          >
            <Zap className="w-4 h-4" />
            Publish
          </Button>

          <AlertDialog open={isConfirmingLogout} onOpenChange={setIsConfirmingLogout}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsConfirmingLogout(true)}
              className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>

            <AlertDialogContent>
              <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to logout? Make sure you&apos;ve saved your changes.
              </AlertDialogDescription>
              <div className="flex gap-2 justify-end">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout} className="bg-red-600">
                  Logout
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
