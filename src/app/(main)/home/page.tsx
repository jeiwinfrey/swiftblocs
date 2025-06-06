"use client";

import { useState, useEffect } from "react";
import { ComponentCard } from "@/components/layout/component-card";
import { ComponentDetails } from "@/components/layout/component-details";
import { HomePageSkeleton } from "@/components/layout/skeletons/home-page-skeleton";
import { getComponents, type Component } from "@/services/supabase/components";
import { COMPONENT_TAGS } from "@/constants/tags";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [components, setComponents] = useState<Component[]>([]);
  const [componentsByTag, setComponentsByTag] = useState<Record<string, Component[]>>({});
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    async function fetchComponents() {
      try {
        const data = await getComponents();
        setComponents(data);
        
        // Group components by tag
        const grouped: Record<string, Component[]> = {};
        
        // Initialize groups for each tag
        COMPONENT_TAGS.forEach(tag => {
          grouped[tag.value] = [];
        });
        
        // Add components to their respective tag groups
        data.forEach(component => {
          if (component.tags && component.tags.length > 0) {
            component.tags.forEach(tag => {
              if (grouped[tag]) {
                grouped[tag].push(component);
              }
            });
          }
        });
        
        // Filter out empty tag groups
        const filteredGrouped: Record<string, Component[]> = {};
        Object.keys(grouped).forEach(tag => {
          if (grouped[tag].length > 0) {
            filteredGrouped[tag] = grouped[tag];
          }
        });
        
        setComponentsByTag(filteredGrouped);
      } catch (error) {
        console.error('Error fetching components:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchComponents();
  }, []);

  // Get the display name for a tag
  const getTagDisplayName = (tagValue: string): string => {
    const tag = COMPONENT_TAGS.find(t => t.value === tagValue);
    return tag ? tag.label : tagValue.charAt(0).toUpperCase() + tagValue.slice(1);
  };

  return (
    <div className="container mx-auto px-1 overflow-y-auto overflow-x-hidden scrollbar-hide h-full">
      <ComponentDetails 
        component={selectedComponent}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
      {loading ? (
        <HomePageSkeleton />
      ) : (
        <div className="space-y-1">
          {Object.keys(componentsByTag).map((tagName) => (
            <section key={tagName} className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">{getTagDisplayName(tagName)}</h3>
                <Link href={`/search?tag=${tagName}`} className="flex items-center text-sm text-primary hover:underline">
                  View all <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
              
              <div className="relative">
                <div className="flex overflow-x-auto pb-2 -mx-4 px-2 space-x-4 scrollbar-hide">
                  {componentsByTag[tagName].map((component) => (
                    <div key={component.id} className="flex-shrink-0 w-64 sm:w-72">
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
                  ))}
                </div>
                {/* Right side fade effect */}
                <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-background to-transparent pointer-events-none"></div>
              </div>
            </section>
          ))}
          
          {components.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No components found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
