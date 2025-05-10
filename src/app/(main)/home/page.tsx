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
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
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
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <p>Loading components...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {componentsWithImageUrls.length > 0 ? (
            componentsWithImageUrls.map((component) => (
              <ComponentCard 
                key={component.id}
                componentTitle={component.component_title}
                viewsCount={component.views_count}
                bookmarksCount={component.bookmarks_count}
                imageUrl={component.imageUrl}
                authorAvatar="" // You can add author avatars later
              />
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-muted-foreground">No components found. Import the sample data to get started.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
