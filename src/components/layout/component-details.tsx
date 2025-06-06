import * as React from "react";
import { Component } from "@/services/supabase/components";
import { CodeBlock, CodeBlockCode } from "@/components/ui/code-block";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Copy, Check, Bookmark, BookmarkCheck } from "lucide-react";

interface ComponentDetailsProps {
  component: Component | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ComponentDetails({
  component,
  open,
  onOpenChange,
}: ComponentDetailsProps) {
  const [copied, setCopied] = React.useState(false);
  const [bookmarked, setBookmarked] = React.useState(false);

  // Copy code to clipboard
  const copyToClipboard = async () => {
    if (!component?.code) return;

    try {
      await navigator.clipboard.writeText(component.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback method for copying
      const textarea = document.createElement('textarea');
      textarea.value = component.code;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Silent fail
      } finally {
        document.body.removeChild(textarea);
      }
    }
  };

  // Toggle bookmark status
  const toggleBookmark = () => {
    setBookmarked(!bookmarked);
    // Here you would implement the actual bookmark functionality with your database
  };

  if (!component) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sr-only">
          <DialogTitle>Component Details</DialogTitle>
          <DialogDescription>View component details and code</DialogDescription>
        </DialogHeader>
        
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
        
        <div className="space-y-6">
          {/* Component title and description */}
          <div>
            <h2 className="text-2xl font-bold">{component.component_title}</h2>
            <p className="text-sm text-muted-foreground mb-2">By {component.author}</p>
            <p className="text-sm">{component.description}</p>
          </div>
          
          {/* Component tags */}
          <div>
            <h3 className="text-sm font-medium mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {component.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Component code */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Code</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={copyToClipboard}
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  <span className="sr-only">Copy code</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={toggleBookmark}
                >
                  {bookmarked ? (
                    <BookmarkCheck className="h-4 w-4" />
                  ) : (
                    <Bookmark className="h-4 w-4" />
                  )}
                  <span className="sr-only">Bookmark component</span>
                </Button>
              </div>
            </div>
            <div className="relative">
              <CodeBlock className="rounded-md border bg-transparent">
                <CodeBlockCode 
                  code={component.code} 
                  language="swift" 
                  theme="github-dark"
                />
              </CodeBlock>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
