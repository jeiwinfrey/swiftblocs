"use client";

import { Button } from "@/components/ui/button";
import { ComponentForm } from "@/components/layout/component-form";
import { useState } from "react";
import { useRouter } from "next/navigation";

const tags = [
  { value: "button", label: "Button" },
  { value: "card", label: "Card" },
  { value: "input", label: "Input" },
  { value: "navigation", label: "Navigation" },
  { value: "layout", label: "Layout" },
  { value: "form", label: "Form" },
  { value: "modal", label: "Modal" },
  { value: "list", label: "List" },
  { value: "animation", label: "Animation" },
];

export default function PublishPage() {
  const router = useRouter();
  const [componentTitle, setComponentTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [code, setCode] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // State is managed and passed to the ComponentForm
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Validate required fields
      if (!componentTitle || !description || !selectedTag || !code || !imageFile) {
        throw new Error('Please fill out all required fields');
      }
      
      // Validate that the code starts with 'import SwiftUI'
      if (!code.trim().startsWith('import SwiftUI')) {
        throw new Error('Your code must start with "import SwiftUI"');
      }
      
      // Create form data for file upload
      const formData = new FormData();
      formData.append('title', componentTitle);
      formData.append('description', description);
      formData.append('tag', selectedTag);
      formData.append('code', code);
      formData.append('image', imageFile);
      
      // Send data to API endpoint
      const response = await fetch('/api/components', {
        method: 'POST',
        body: formData,
      });
      
      // Parse the response
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to publish component');
      }
      
      // Redirect to home page after successful submission
      router.push('/');
    } catch (err) {
      console.error('Error publishing component:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container max-w-6xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row min-h-[calc(100vh-200px)]">
          {/* Left side - Component information */}
          <ComponentForm
            componentTitle={componentTitle}
            setComponentTitle={setComponentTitle}
            description={description}
            setDescription={setDescription}
            selectedTag={selectedTag}
            setSelectedTag={setSelectedTag}
            imageFile={imageFile}
            setImageFile={setImageFile}
            tags={tags}
          />
          
          {/* Right side - Code */}
          <div className="md:w-1/2 pl-0 md:pl-0 mt-8 md:mt-0 md:-ml-4 relative z-10 flex flex-col">
            <textarea
              id="code-input"
              className="w-full flex-grow min-h-[400px] p-6 font-mono text-sm bg-secondary/30 border-0 rounded-none rounded-tr-lg focus:outline-none focus:ring-0 resize-none"
              placeholder="// Paste your SwiftUI code here"
              value={code}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCode(e.target.value)}
              required
            />
            <div className="bg-secondary/30 p-4 flex justify-between items-center rounded-none rounded-br-lg">
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <div className="ml-auto">
                <Button 
                  type="submit" 
                  size="lg" 
                  className="px-8" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Publishing...' : 'Publish'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}