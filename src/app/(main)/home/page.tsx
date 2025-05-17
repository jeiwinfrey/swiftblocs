"use client";

import { useState, useEffect } from "react";
import { ComponentCard } from "@/components/layout/component-card";
import { HomePageSkeleton } from "@/components/layout/home-page-skeleton";
import { getComponents, type Component } from "@/services/supabase/components";

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [components, setComponents] = useState<Component[]>([]);

  useEffect(() => {
    async function fetchComponents() {
      try {
        const data = await getComponents();
        setComponents(data);
      } catch (error) {
        console.error('Error fetching components:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchComponents();
  }, []);

  return (
    <div className="container mx-auto">
      {loading ? (
        <HomePageSkeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {components.length > 0 && components.map((component) => (
            <ComponentCard 
              key={component.id}
              componentTitle={component.component_title}
              author={component.author}
              viewsCount={component.views_count}
              bookmarksCount={component.bookmarks_count}
              imageUrl={component.imageUrl || ''}
            />
          ))}
        </div>
      )}
    </div>
  );
}
