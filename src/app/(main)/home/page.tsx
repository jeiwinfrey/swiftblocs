"use client";

import { useState, useEffect } from "react";
import { ComponentCard } from "@/components/layout/component-card";
import { supabase } from "@/lib/supabase";

// Define the Component type based on your database schema
type Component = {
  id: string;
  author: string;
  component_title: string;
  description: string;
  views_count: number;
  bookmarks_count: number;
  image_storage_path: string;
  image_file_name: string;
  tags: string[];
  code: string;
  created_at: string;
};

export default function HomePage() {
  const [components, setComponents] = useState<Component[]>([]);

  useEffect(() => {
    async function fetchComponents() {
      try {
        const { data, error } = await supabase
          .from('components')
          .select('*')
          .order('views_count', { ascending: false });

        if (error) {
          console.error('Error fetching components:', error);
          return;
        }

        setComponents(data || []);
      } catch (error) {
        console.error('Error:', error);
      }
    }

    fetchComponents();
  }, []);

  // Generate image URLs for the components
  const componentsWithImageUrls = components.map((component) => ({
    ...component,
    // Construct the image URL from the storage path and file name
    imageUrl: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${component.image_storage_path}/${component.image_file_name}`
  }));

  return (
    <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {componentsWithImageUrls.length > 0 && componentsWithImageUrls.map((component) => (
              <ComponentCard 
                key={component.id}
                componentTitle={component.component_title}
                author={component.author}
                viewsCount={component.views_count}
                bookmarksCount={component.bookmarks_count}
                imageUrl={component.imageUrl}
              />
            ))}
      </div>
    </div>
  );
}