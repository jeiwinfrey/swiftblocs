'use client';

import { useState, useEffect } from 'react';
import { ProfileView } from '../../../components/layout/profile-view';
import { useAuth } from '@/components/auth/auth-provider';
import { Component, getComponents, getComponentById, updateComponent, deleteComponent, UpdateComponentPayload } from '@/services/supabase/components';
import { ComponentForm } from '../../../components/layout/component-form';
import { COMPONENT_TAGS } from '../../../constants/tags';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { CheckCircle } from 'lucide-react';

export default function SubmissionsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [components, setComponents] = useState<Component[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Edit mode state
  const [editMode, setEditMode] = useState(false);
  const [componentToEdit, setComponentToEdit] = useState<Component | null>(null);
  const [componentTitle, setComponentTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [code, setCode] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  
  // Get user profile from auth context
  const userProfile = {
    displayName: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User',
    username: user?.user_metadata?.username || user?.email?.split('@')[0] || 'user',
    bio: user?.user_metadata?.bio || 'SwiftBlocs user',
    avatarUrl: user?.user_metadata?.avatar_url
  };
  
  // Handle component deletion
  const handleDeleteComponent = async (componentId: string) => {
    try {
      // Show loading state (could add a loading indicator here)
      setIsLoading(true);
      
      // Call the API to delete the component
      const success = await deleteComponent(componentId);
      
      if (success) {
        // Update local state if deletion was successful
        setComponents(components.filter(c => c.id !== componentId));
        console.log(`Component ${componentId} deleted successfully`);
      } else {
        console.error(`Failed to delete component ${componentId}`);
        // Could show an error message to the user here
      }
    } catch (error) {
      console.error('Error deleting component:', error);
      // Could show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle editing a component
  const handleEdit = async (component: Component) => {
    try {
      // Get the full component data
      const fullComponent = await getComponentById(component.id);
      if (fullComponent) {
        setComponentToEdit(fullComponent);
        // Initialize form state
        setComponentTitle(fullComponent.component_title || '');
        setDescription(fullComponent.description || '');
        setSelectedTag(fullComponent.tags?.[0] || '');
        setCode(fullComponent.code || '');
        setImageUrl(fullComponent.imageUrl || null);
        setEditMode(true);
      }
    } catch (err) {
      console.error('Error loading component for edit:', err);
    }
  };
  
  // Handle form submission for editing
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!componentToEdit) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Validate required fields
      if (!componentTitle || !description || !selectedTag || !code) {
        throw new Error('Please fill out all required fields');
      }
      
      // Validate that the code starts with 'import SwiftUI'
      if (!code.trim().startsWith('import SwiftUI')) {
        throw new Error('Your code must start with "import SwiftUI"');
      }
      
      // Prepare the update payload
      const updates: UpdateComponentPayload = {
        component_title: componentTitle,
        description,
        tags: [selectedTag],
        code,
      };
      
      // Call the API to update the component
      const updatedComponent = await updateComponent(componentToEdit.id, updates);
      
      if (!updatedComponent) {
        throw new Error('Failed to update component in the database');
      }
      
      // Update the component in the local state
      setComponents(components.map(c => 
        c.id === updatedComponent.id ? updatedComponent : c
      ));
      
      // Show success dialog
      setShowSuccessDialog(true);
    } catch (err) {
      console.error('Error updating component:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Close edit mode and reset form
  const handleCancelEdit = () => {
    setEditMode(false);
    setComponentToEdit(null);
    setComponentTitle("");
    setDescription("");
    setSelectedTag("");
    setCode("");
    setImageFile(null);
    setImageUrl(null);
    setError(null);
  };
  
  // Close success dialog and reset form
  const handleCloseSuccessDialog = () => {
    setShowSuccessDialog(false);
    setEditMode(false);
    setComponentToEdit(null);
    setComponentTitle("");
    setDescription("");
    setSelectedTag("");
    setCode("");
    setImageFile(null);
    setImageUrl(null);
    setError(null);
  };
  


  useEffect(() => {
    // Only fetch data when auth is done loading and we have a user
    if (authLoading) return;
    
    async function fetchData() {
      try {
        const allComponents = await getComponents();
        // Filter components by the current user's username
        const userComponents = allComponents.filter(
          component => user && component.author === userProfile.username
        );
        setComponents(userComponents);
      } catch (error) {
        console.error('Error fetching components:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, [authLoading, user, userProfile.username]);

  if (authLoading || isLoading) {
    return <div className="p-8">Loading submissions...</div>;
  }
  
  if (!user) {
    return <div className="p-8">Please sign in to view your submissions.</div>;
  }

  // If in edit mode, show the edit form instead of the profile view
  if (editMode && componentToEdit) {
    return (
      <div className="container max-w-6xl mx-auto">
        {/* Success Dialog */}
        <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-500" />
                Component Updated
              </DialogTitle>
              <DialogDescription>
                Your component has been successfully updated and is now available on SwiftBlocs.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <Button onClick={handleCloseSuccessDialog}>
                Back to Submissions
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Edit Component</h1>
          <Button variant="outline" onClick={handleCancelEdit}>
            Cancel
          </Button>
        </div>
        
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
              imageUrl={imageUrl}
              tags={COMPONENT_TAGS}
              isEditMode={true}
            />
            
            {/* Right side - Code */}
            <div className="md:w-1/2 pl-0 md:pl-0 mt-8 md:mt-0 md:-ml-10 relative z-10 flex flex-col flex-grow">
              <textarea
                id="code-input"
                className="w-full flex-grow min-h-[400px] pt-7 pr-5 pb-7 pl-15 font-mono text-sm bg-secondary/30 border-0 rounded-none rounded-tr-lg focus:outline-none focus:ring-0 resize-none"
                placeholder={`import SwiftUI\n\nstruct ContentView: View {\n    var body: some View {\n        Text("Hello, SwiftUI!")\n            .font(.title)\n            .foregroundColor(.blue)\n    }\n}\n\nstruct ContentView_Previews: PreviewProvider {\n    static var previews: some View {\n        ContentView()\n    }\n}`}
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
                    {isSubmitting ? 'Updating...' : 'Update'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
  
  // Otherwise show the normal profile view
  return (
    <ProfileView
      displayName={userProfile.displayName}
      username={userProfile.username}
      bio={userProfile.bio}
      avatarUrl={userProfile.avatarUrl}
      components={components}
      onDeleteComponent={handleDeleteComponent}
      onEditComponent={handleEdit}
      showEditDelete={true}
    />
  );
}
