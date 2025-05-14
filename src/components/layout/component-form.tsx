"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FileInput } from "@/components/ui/file-input";
import Image from "next/image";

export interface ComponentFormProps {
  componentTitle: string;
  setComponentTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  selectedTag: string;
  setSelectedTag: (value: string) => void;
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
  tags: Array<{ value: string; label: string }>;
}

export function ComponentForm({
  componentTitle,
  setComponentTitle,
  description,
  setDescription,
  selectedTag,
  setSelectedTag,
  imageFile,
  setImageFile,
  tags
}: ComponentFormProps) {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  return (
    <div className="md:w-1/2 pr-0 md:pr-8 space-y-2 bg-card p-6 rounded-lg border shadow-sm relative z-20">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Publish a component.</h2>
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 rounded-full bg-red-400"></div>
          <span className="text-sm font-medium text-red-400">Required</span>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-1">
          <div className="flex items-center">
            <Label htmlFor="component-title" className="font-medium">Name</Label>
            <span className="text-red-400 ml-1">*</span>
          </div>
          <Input
            id="component-title"
            placeholder="e.g. &quot;Button&quot;"
            value={componentTitle}
            onChange={(e) => setComponentTitle(e.target.value)}
            required
            className="bg-background/80"
          />
          <p className="text-sm text-muted-foreground">The display name of your component</p>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center">
            <Label htmlFor="description" className="font-medium">Description</Label>
            <span className="text-red-400 ml-1">*</span>
          </div>
          <Textarea
            id="description"
            placeholder="Add some description to help others discover your component"
            className="min-h-[100px] bg-background/80"
            value={description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
            required
          />
          <p className="text-sm text-muted-foreground">A brief description of what your component does</p>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center">
            <Label htmlFor="tag" className="font-medium">Component type</Label>
            <span className="text-red-400 ml-1">*</span>
          </div>
          <Select
            value={selectedTag}
            onValueChange={setSelectedTag}
            required
          >
            <SelectTrigger id="tag" className="w-full bg-background/80">
              <SelectValue placeholder="UI Component" />
            </SelectTrigger>
            <SelectContent>
              {tags.map((tag) => (
                <SelectItem key={tag.value} value={tag.value}>
                  {tag.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">The category your component belongs to</p>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center">
            <Label htmlFor="image" className="font-medium">Cover Image</Label>
            <span className="text-red-400 ml-1">*</span>
          </div>
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center bg-background/80">
            <div className="flex flex-col items-center justify-center">
              {imageFile ? (
                <div className="space-y-4 w-full">
                  <div className="relative w-full h-48 rounded-md overflow-hidden bg-secondary/30">
                    <div className="absolute inset-0 flex items-center justify-center">
                      {/* Image preview */}
                      <Image 
                        src={URL.createObjectURL(imageFile)} 
                        alt="Preview" 
                        className="w-full h-full object-contain"
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate max-w-[200px]">{imageFile.name}</p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setImageFile(null)}
                    >
                      Change image
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-4 bg-secondary/50 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-foreground">
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"/>
                      <line x1="16" x2="22" y1="5" y2="5"/>
                      <line x1="19" x2="19" y1="2" y2="8"/>
                      <circle cx="9" cy="9" r="2"/>
                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                    </svg>
                  </div>
                  <p className="text-sm font-medium mb-1">Click to upload</p>
                  <p className="text-xs text-muted-foreground">or drag and drop</p>
                  <FileInput
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    required
                    className="hidden"
                  />
                  <label htmlFor="image" className="mt-4 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 cursor-pointer">
                    Choose file
                  </label>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
