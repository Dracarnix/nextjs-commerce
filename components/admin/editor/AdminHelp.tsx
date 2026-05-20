'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HelpCircle } from 'lucide-react';

export default function AdminHelp() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <HelpCircle className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editor Help & Documentation</DialogTitle>
          <DialogDescription>
            Complete guide to using the website editor
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="getting-started" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
            <TabsTrigger value="editing">Editing</TabsTrigger>
            <TabsTrigger value="elements">Elements</TabsTrigger>
            <TabsTrigger value="publishing">Publishing</TabsTrigger>
          </TabsList>

          <TabsContent value="getting-started" className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Welcome to the Website Editor</h3>
              <p className="text-sm text-slate-600 mb-4">
                This is a Figma-like editor for designing your website pages. All pages are editable through this interface.
              </p>

              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm mb-1">Navigation</h4>
                  <ul className="text-sm text-slate-600 space-y-1 ml-4 list-disc">
                    <li><strong>Left Panel:</strong> View layers and add new elements</li>
                    <li><strong>Canvas:</strong> Drag elements to arrange your page</li>
                    <li><strong>Right Panel:</strong> Edit properties of selected elements</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-1">Pages</h4>
                  <p className="text-sm text-slate-600">
                    Use the page dropdown in the toolbar to switch between pages. Create new pages with the "New Page" button.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="editing" className="space-y-4">
            <div>
              <h3 className="font-semibold mb-3">Editing Elements</h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Selection</h4>
                  <ul className="text-sm text-slate-600 space-y-1 ml-4 list-disc">
                    <li>Click an element to select it</li>
                    <li>Hold Shift+Click to select multiple elements</li>
                    <li>Drag to create a selection box around multiple elements</li>
                    <li>Press Escape to deselect all</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">Manipulation</h4>
                  <ul className="text-sm text-slate-600 space-y-1 ml-4 list-disc">
                    <li>Drag to move elements on the canvas</li>
                    <li>Use resize handles on corners to resize</li>
                    <li>Edit properties in the right panel</li>
                    <li>Delete with Delete or Backspace key</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">Canvas Navigation</h4>
                  <ul className="text-sm text-slate-600 space-y-1 ml-4 list-disc">
                    <li>Scroll to zoom in/out</li>
                    <li>Hold Space + Drag to pan around</li>
                    <li>Press 'G' to toggle grid overlay</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="elements" className="space-y-4">
            <div>
              <h3 className="font-semibold mb-3">Available Elements</h3>

              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm">Text</h4>
                  <p className="text-sm text-slate-600">
                    Paragraphs, headings, or any text. Edit content, font, size, color, and alignment in the properties panel.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-sm">Image</h4>
                  <p className="text-sm text-slate-600">
                    Display images from URLs. Set object-fit, alt text, and dimensions.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-sm">Button</h4>
                  <p className="text-sm text-slate-600">
                    Interactive buttons with customizable colors, labels, and links.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-sm">Link</h4>
                  <p className="text-sm text-slate-600">
                    Clickable text links to pages or external URLs.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-sm">Shape</h4>
                  <p className="text-sm text-slate-600">
                    Rectangles and shapes with custom fill colors and borders.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-sm">Frame</h4>
                  <p className="text-sm text-slate-600">
                    Container for grouping elements with custom background and padding.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-sm">Spacer</h4>
                  <p className="text-sm text-slate-600">
                    Empty space for layout and spacing control.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-sm">Navigation Bar</h4>
                  <p className="text-sm text-slate-600">
                    Header navigation with editable links to your pages.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="publishing" className="space-y-4">
            <div>
              <h3 className="font-semibold mb-3">Saving & Publishing</h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Save Draft</h4>
                  <p className="text-sm text-slate-600 mb-2">
                    Click "Save Draft" to save your current layout. Drafts are stored locally.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">Publish</h4>
                  <p className="text-sm text-slate-600 mb-2">
                    Click "Publish" to push your changes to GitHub and trigger a Vercel redeploy. Your website will be updated automatically.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">Status Indicators</h4>
                  <ul className="text-sm text-slate-600 space-y-1 ml-4 list-disc">
                    <li><strong>Saving...</strong> - Changes are being saved</li>
                    <li><strong>Draft Saved</strong> - Changes saved successfully</li>
                    <li><strong>Publishing...</strong> - Changes are being published</li>
                    <li><strong>Published!</strong> - Successfully published to live site</li>
                  </ul>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                  <p className="text-sm text-blue-900">
                    <strong>Tip:</strong> Always save before publishing. Publishing will save your current draft and push it to GitHub.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
