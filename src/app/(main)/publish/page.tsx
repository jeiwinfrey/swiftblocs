"use client";

import { Button } from "@/components/ui/button";
import { ComponentForm } from "@/components/layout/component-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";
import { COMPONENT_TAGS } from "@/constants/tags";
import { usePublishForm } from "@/hooks/usePublishForm";

export default function PublishPage() {
  const {
    componentTitle,
    setComponentTitle,
    description,
    setDescription,
    selectedTag,
    setSelectedTag,
    code,
    setCode,
    imageFile,
    setImageFile,
    isSubmitting,
    error,
    showSuccessDialog,
    setShowSuccessDialog,
    handleSubmit,
    handleGoToHome
  } = usePublishForm();
  
  return (
    <div className="container max-w-6xl mx-auto">
      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              Component Published
            </DialogTitle>
            <DialogDescription>
              Your component has been successfully published and is now available on SwiftBlocs.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button onClick={handleGoToHome}>
              Go to Home
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
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
            tags={COMPONENT_TAGS}
          />
          
          {/* Right side - Code */}
          <div className="md:w-1/2 pl-0 md:pl-0 mt-8 md:mt-0 md:-ml-10 relative z-10 flex flex-col flex-grow">
            <textarea
              id="code-input"
              className="w-full flex-grow min-h-[400px] pt-7 pr-5 pb-7 pl-15 font-mono text-sm bg-secondary/30 border-0 rounded-none rounded-tr-lg focus:outline-none focus:ring-0 resize-none"
              placeholder={`import SwiftUI\n\nstruct ContentView: View {\n    var body: some View {\n        Text(\"Hello, SwiftUI!\")\n            .font(.title)\n            .foregroundColor(.blue)\n    }\n}\n\nstruct ContentView_Previews: PreviewProvider {\n    static var previews: some View {\n        ContentView()\n    }\n}`}
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