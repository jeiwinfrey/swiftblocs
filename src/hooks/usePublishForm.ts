import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { Component, getComponentById } from "@/services/supabase/components";

/**
 * Custom hook for managing the component publish form
 */
export function usePublishForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const isEditMode = !!editId;
  
  const [componentTitle, setComponentTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [code, setCode] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null); // For displaying existing image
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [componentToEdit, setComponentToEdit] = useState<Component | null>(null);

  // Get the current user on component mount
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    
    fetchUser();
  }, []);
  
  // Load component data if in edit mode
  useEffect(() => {
    if (isEditMode && editId) {
      const loadComponentData = async () => {
        try {
          const component = await getComponentById(editId);
          if (component) {
            setComponentToEdit(component);
            setComponentTitle(component.component_title || '');
            setDescription(component.description || '');
            setSelectedTag(component.tags?.[0] || '');
            setCode(component.code || '');
            setImageUrl(component.imageUrl || null);
            console.log('Loaded component for editing:', component);
          } else {
            setError('Component not found');
          }
        } catch (err) {
          console.error('Error loading component:', err);
          setError('Failed to load component data');
        }
      };
      
      loadComponentData();
    }
  }, [isEditMode, editId]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Validate required fields - in edit mode, image is optional if we already have one
      if (!componentTitle || !description || !selectedTag || !code) {
        throw new Error('Please fill out all required fields');
      }
      
      if (!isEditMode && !imageFile) {
        throw new Error('Please upload an image for your component');
      }
      
      // Validate that the code starts with 'import SwiftUI'
      if (!code.trim().startsWith('import SwiftUI')) {
        throw new Error('Your code must start with "import SwiftUI"');
      }
      
      // Validate that user is logged in
      if (!user) {
        throw new Error('You must be logged in to publish a component');
      }
      
      // Create form data for file upload
      const formData = new FormData();
      formData.append('title', componentTitle);
      formData.append('description', description);
      formData.append('tag', selectedTag);
      formData.append('code', code);
      if (imageFile) {
        formData.append('image', imageFile);
      }
      formData.append('userId', user.id);
      
      // If editing, add the component ID
      if (isEditMode && editId) {
        formData.append('componentId', editId);
      }
      
      // Send data to API endpoint
      const endpoint = isEditMode ? '/api/components/edit' : '/api/components';
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });
      
      // Parse the response
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || `Failed to ${isEditMode ? 'update' : 'publish'} component`);
      }
      
      // Show success dialog instead of alert
      setShowSuccessDialog(true);
    } catch (err) {
      console.error(`Error ${isEditMode ? 'updating' : 'publishing'} component:`, err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setIsSubmitting(false);
    }
  };
  
  // Function to handle navigation after successful publish
  const handleGoToHome = () => {
    // Get the sidebar context to update active item
    try {
      // Access the sidebar context and set the active item to 'home'
      const sidebarContext = document.querySelector('[data-sidebar="menu-button"][data-active="true"]');
      if (sidebarContext) {
        sidebarContext.setAttribute('data-active', 'false');
      }
      
      // Find the home menu item and set it as active
      const homeMenuItem = document.querySelector('[data-sidebar="menu-button"][data-value="home"]');
      if (homeMenuItem) {
        homeMenuItem.setAttribute('data-active', 'true');
      }
    } catch (err) {
      console.error('Error updating sidebar active item:', err);
    }
    
    // Close the dialog and navigate to home
    setShowSuccessDialog(false);
    router.push('/');
    router.refresh();
  };

  return {
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
    imageUrl,
    isSubmitting,
    error,
    showSuccessDialog,
    setShowSuccessDialog,
    handleSubmit,
    handleGoToHome,
    isEditMode,
    componentToEdit
  };
}
