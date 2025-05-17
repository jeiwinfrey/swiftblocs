import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

/**
 * Custom hook for managing the component publish form
 */
export function usePublishForm() {
  const router = useRouter();
  const [componentTitle, setComponentTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [code, setCode] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Get the current user on component mount
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    
    fetchUser();
  }, []);
  
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
      formData.append('image', imageFile);
      formData.append('userId', user.id); // Add the user ID to the form data
      
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
      
      // Show success dialog instead of alert
      setShowSuccessDialog(true);
    } catch (err) {
      console.error('Error publishing component:', err);
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
    isSubmitting,
    error,
    showSuccessDialog,
    setShowSuccessDialog,
    handleSubmit,
    handleGoToHome
  };
}
