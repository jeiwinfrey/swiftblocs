"use client";

import { useState, useEffect } from "react";
import { ComponentCard } from "@/components/layout/component-card";
import { ComponentDetails } from "@/components/layout/component-details";
import { HomePageSkeleton } from "@/components/layout/skeletons/home-page-skeleton";
import { getComponents, type Component } from "@/services/supabase/components";
import { COMPONENT_TAGS } from "@/constants/tags";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [components, setComponents] = useState<Component[]>([]);
  const [componentsByTag, setComponentsByTag] = useState<Record<string, Component[]>>({});
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [filteredComponents, setFilteredComponents] = useState<Component[]>([]);

  useEffect(() => {
    async function fetchComponents() {
      try {
        const data = await getComponents();
        setComponents(data);
        
        // Group components by tag
        const grouped: Record<string, Component[]> = {};
        
        // Initialize groups for each tag and add components to their groups
        COMPONENT_TAGS.forEach(tag => {
          grouped[tag.value] = data.filter(component => 
            component.tags?.includes(tag.value)
          );
        });
        
        // Keep only non-empty groups
        const filteredGrouped = Object.fromEntries(
          Object.entries(grouped).filter(([, components]) => components.length > 0)
        );
        
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
    return COMPONENT_TAGS.find(t => t.value === tagValue)?.label || 
      tagValue.charAt(0).toUpperCase() + tagValue.slice(1);
  };
  
  // Handle viewing all components of a specific tag
  const handleViewAllTag = (tagName: string) => {
    setActiveTag(tagName);
    setFilteredComponents(components.filter(component => 
      component.tags?.includes(tagName)
    ));
  };
  
  // Go back to all tags view
  const handleBackToAll = () => {
    setActiveTag(null);
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
      ) : activeTag ? (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-1" 
              onClick={handleBackToAll}
            >
              <ArrowLeft className="h-4 w-4" /> Back to all categories
            </Button>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-4">{getTagDisplayName(activeTag)} Components</h2>
            <p className="text-muted-foreground mb-6">
              {filteredComponents.length} {filteredComponents.length === 1 ? 'component' : 'components'} found
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredComponents.map((component) => (
                <ComponentCard
                  key={component.id}
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
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-1">
          {Object.keys(componentsByTag).map((tagName) => (
            <section key={tagName} className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">{getTagDisplayName(tagName)}</h3>
                <Button 
                  variant="link" 
                  className="flex items-center text-sm text-primary p-0 h-auto"
                  onClick={() => handleViewAllTag(tagName)}
                >
                  View all <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
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
