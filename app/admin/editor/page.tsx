import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import EditorToolbar from '@/components/admin/editor/EditorToolbar';
import LeftPanel from '@/components/admin/editor/LeftPanel';
import RightPanel from '@/components/admin/editor/RightPanel';
import Canvas from '@/components/admin/editor/Canvas';
import KeyboardShortcutsHandler from '@/components/admin/editor/KeyboardShortcutsHandler';
import KeyboardShortcutsDialog from '@/components/admin/editor/KeyboardShortcutsDialog';
import { Toaster } from 'sonner';

export const metadata = {
  title: 'Editor | THE VYZN Admin',
  description: 'Website editor for THE VYZN',
};

export default async function EditorPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Toaster />
      <KeyboardShortcutsHandler />
      
      {/* Left Panel - Layers & Elements */}
      <LeftPanel />

      {/* Main Editor Area */}
      <div className="flex flex-col flex-1">
        <EditorToolbar />
        <div className="absolute top-20 right-80 z-40">
          <KeyboardShortcutsDialog />
        </div>
        <Canvas />
      </div>

      {/* Right Panel - Properties */}
      <RightPanel />
    </div>
  );
}
