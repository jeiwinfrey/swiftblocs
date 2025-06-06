"use client";

import { useState, useEffect } from "react";
import { ComponentCard } from "@/components/layout/component-card";
import { getComponents, type Component } from "@/services/supabase/components";
import { Button } from "@/components/ui/button";
import { ComponentPageSkeleton } from "@/components/layout/skeletons/component-page-skeleton";
import { ComponentDetails } from "@/components/layout/component-details";

type SortOption = 'newest' | 'oldest' | 'most-viewed' | 'most-bookmarked';

export default function ComponentsPage() {
  const [loading, setLoading] = useState(true);
  const [components, setComponents] = useState<Component[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [originalComponents, setOriginalComponents] = useState<Component[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    async function fetchComponents() {
      try {
        const data = await getComponents();
        setOriginalComponents(data);
        // Sort by newest by default
        const sortedData = [...data].sort((a, b) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        setComponents(sortedData);
      } catch (error) {
        console.error('Error fetching components:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchComponents();
  }, []);
  
  const handleSort = (option: SortOption) => {
    setSortOption(option);
    const sortedComponents = [...originalComponents];
    
    switch (option) {
      case 'newest':
        sortedComponents.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'oldest':
        sortedComponents.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'most-viewed':
        sortedComponents.sort((a, b) => b.views_count - a.views_count);
        break;
      case 'most-bookmarked':
        sortedComponents.sort((a, b) => b.bookmarks_count - a.bookmarks_count);
        break;
    }
    
    setComponents(sortedComponents);
  };

  return (
    <div className="container mx-auto px-1 overflow-y-auto overflow-x-hidden scrollbar-hide h-full">
      <ComponentDetails 
        component={selectedComponent}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
      <div className="flex flex-wrap gap-2 mb-4">
        <Button 
          variant={sortOption === 'newest' ? "default" : "outline"} 
          size="sm" 
          onClick={() => handleSort('newest')}
        >
          Newest
        </Button>
        <Button 
          variant={sortOption === 'oldest' ? "default" : "outline"} 
          size="sm" 
          onClick={() => handleSort('oldest')}
        >
          Oldest
        </Button>
        <Button 
          variant={sortOption === 'most-viewed' ? "default" : "outline"} 
          size="sm" 
          onClick={() => handleSort('most-viewed')}
        >
          Most Viewed
        </Button>
        <Button 
          variant={sortOption === 'most-bookmarked' ? "default" : "outline"} 
          size="sm" 
          onClick={() => handleSort('most-bookmarked')}
        >
          Most Bookmarked
        </Button>
      </div>
      
      {loading ? (
        <ComponentPageSkeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {components.length > 0 ? (
            components.map((component) => (
              <div key={component.id}>
                <ComponentCard 
                  componentTitle={component.component_title}
                  author={component.author}
                  viewsCount={component.views_count}
                  bookmarksCount={component.bookmarks_count}
                  imageUrl={component.imageUrl || ''}
                  onClick={() => {
                    setSelectedComponent(component);
                    setDetailsOpen(true);
                  }}
                />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-lg text-muted-foreground">No components found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}