"use client"

import * as React from "react"
import Image from "next/image"
import { Command as CommandPrimitive } from "cmdk"
import { 
  SearchIcon, 
  TagIcon, 
  LayoutGridIcon, 
  Loader2Icon,
  AlertCircleIcon 
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { getComponents, Component as DbComponent } from "@/services/supabase/components"
import { ComponentDetails } from "@/components/layout/component-details"

// Interface for components in the search bar
interface SearchableComponent {
  id: string
  name: string
  tags: string[]
  previewImageUrl: string
}

// --- Core Command Components (adapted from ui/command.tsx) ---
const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      "bg-background text-foreground flex h-full w-full flex-col overflow-hidden rounded-md",
      className
    )}
    {...props}
  />
))
Command.displayName = CommandPrimitive.displayName

const CommandDialog = ({ children, ...props }: React.ComponentPropsWithoutRef<typeof Dialog>) => {
  return (
    <Dialog {...props}>
      {/* Ensure consistent width and allow vertical scroll for content inside DialogContent */}
      <DialogContent className="overflow-hidden p-0 shadow-lg sm:max-w-3xl flex flex-col max-h-[80vh]">
        {/* Add visually hidden title and description for accessibility */}
        <div className="sr-only">
          <DialogTitle>Component Search</DialogTitle>
          <DialogDescription>Search for components by name or tag</DialogDescription>
        </div>
        <Command className="[&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  // CommandInput is the first child of CommandDialog's children, so it's not part of the scrollable area
  <div className="flex items-center px-4 flex-shrink-0" cmdk-input-wrapper="">
    <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "placeholder:text-muted-foreground flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  </div>
))
CommandInput.displayName = CommandPrimitive.Input.displayName

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  // This list will grow and scroll within its parent flex container
  <CommandPrimitive.List
    ref={ref}
    className={cn("overflow-y-auto overflow-x-hidden", className)} 
    {...props}
  />
))
CommandList.displayName = CommandPrimitive.List.displayName

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className="py-6 text-center text-sm"
    {...props}
  />
))
CommandEmpty.displayName = CommandPrimitive.Empty.displayName

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "text-foreground [&_[cmdk-group-heading]]:text-muted-foreground overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium",
      className
    )}
    {...props}
  />
))
CommandGroup.displayName = CommandPrimitive.Group.displayName

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "aria-selected:bg-accent aria-selected:text-accent-foreground relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
      className
    )}
    {...props}
  />
))
CommandItem.displayName = CommandPrimitive.Item.displayName
// --- End Core Command Components ---

interface ComponentSearchBarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ComponentSearchBar({
  open,
  onOpenChange,
}: ComponentSearchBarProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [hoveredComponent, setHoveredComponent] = React.useState<SearchableComponent | null>(null);
  const [components, setComponents] = React.useState<SearchableComponent[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [fetchError, setFetchError] = React.useState<string | null>(null);
  const [selectedComponent, setSelectedComponent] = React.useState<DbComponent | null>(null);
  const [detailsOpen, setDetailsOpen] = React.useState(false);



  // Store the original database components for reference
  const [dbComponentsMap, setDbComponentsMap] = React.useState<Record<string, DbComponent>>({});

  const fetchComponents = React.useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const dbComponents = await getComponents();
      
      // Create a map of components by ID for quick lookup
      const componentsMap = Object.fromEntries(
        dbComponents.map(component => [component.id, component])
      );
      setDbComponentsMap(componentsMap);
      
      // Map to SearchableComponent interface
      const searchableComponents = dbComponents.map(component => ({
        id: component.id,
        name: component.component_title,
        tags: component.tags || [],
        previewImageUrl: component.imageUrl || '/placeholder-image.svg'
      }));
      
      setComponents(searchableComponents);
    } catch (error) {
      console.error("Failed to fetch components:", error);
      setFetchError("Failed to load components. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (open && components.length === 0 && !isLoading) { 
      fetchComponents();
    }
  }, [open, components.length, isLoading, fetchComponents]);

  const handleSelectComponent = (component: SearchableComponent) => {
    // Get the full component details from the map
    const fullComponent = dbComponentsMap[component.id];
    if (fullComponent) {
      setSelectedComponent(fullComponent);
      setDetailsOpen(true);
      onOpenChange(false); // Close the search dialog
      setSearchQuery(""); // Reset search query
    } else {
      console.error("Component not found in database:", component.id);
    }
  };

  const filteredComponents = React.useMemo(() => {
    if (!searchQuery) return components;
    
    const query = searchQuery.toLowerCase();
    return components.filter(component =>
      component.name.toLowerCase().includes(query) ||
      component.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }, [searchQuery, components]);

  const tags = React.useMemo(() => {
    const allTags = new Set<string>();
    components.forEach(component => 
      component.tags.forEach(tag => allTags.add(tag))
    );
    return Array.from(allTags).sort();
  }, [components]);

  return (
    <>
      <ComponentDetails 
        component={selectedComponent} 
        open={detailsOpen} 
        onOpenChange={setDetailsOpen} 
      />
      <CommandDialog open={open} onOpenChange={onOpenChange}>
        <div className="flex flex-col h-full">
          <CommandInput
            placeholder="Search components or tags..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          {/* This div will contain the scrollable panes and the footer */}
          <div className="flex border-t flex-grow min-h-0"> {/* Panes container: allow to grow and scroll */}
            {/* Left Pane: Categories/Search Results */}
            <div className="w-1/2 border-r flex flex-col"> 
              <CommandList onMouseLeave={() => setHoveredComponent(null)} className="flex-grow p-1 overflow-y-auto max-h-[60vh]">
                {isLoading && (
                  <div className="flex items-center justify-center p-6 text-sm text-muted-foreground">
                    <Loader2Icon className="mr-2 h-5 w-5 animate-spin" />
                    Loading components...
                  </div>
                )}
                {fetchError && !isLoading && (
                  <div className="flex flex-col items-center justify-center p-6 text-sm text-destructive">
                    <AlertCircleIcon className="mb-2 h-8 w-8" />
                    <p className="font-medium">{fetchError}</p>
                     <Button variant="outline" size="sm" onClick={fetchComponents} className="mt-3">
                        <Loader2Icon className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : 'hidden'}`} />
                        Retry
                    </Button>
                  </div>
                )}
                {!isLoading && !fetchError && (
                  <>
                    {searchQuery.length === 0 && (
                      <>
                        {/* Tags section */}
                        <CommandGroup heading="Tags">
                          {tags.map((tag) => (
                            <CommandItem
                              key={`tag-${tag}`}
                              onSelect={() => setSearchQuery(tag)}
                              className="flex items-center gap-2"
                              value={`category-${tag}`}
                            >
                              <TagIcon className="h-4 w-4 text-muted-foreground" />
                              <span>{tag}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                        
                        {/* All Components section */}
                        <CommandGroup heading="All Components">
                          {components.map((component) => (
                            <CommandItem
                              key={component.id}
                              onSelect={() => handleSelectComponent(component)}
                              onMouseEnter={() => setHoveredComponent(component)}
                              className="flex items-center gap-2"
                              value={component.name}
                            >
                              <LayoutGridIcon className="h-4 w-4 text-muted-foreground" />
                              <span>{component.name}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </>
                    )}
                    
                    {searchQuery.length > 0 && (
                      <CommandGroup heading="Results">
                        {filteredComponents.length > 0 ? (
                          filteredComponents.map((component) => (
                            <CommandItem
                              key={component.id}
                              onSelect={() => handleSelectComponent(component)}
                              onMouseEnter={() => setHoveredComponent(component)}
                              className="flex items-center gap-2"
                              value={component.name}
                            >
                              <LayoutGridIcon className="h-4 w-4 text-muted-foreground" />
                              <span>{component.name}</span>
                            </CommandItem>
                          ))
                        ) : (
                          <CommandEmpty>No components found for &quot;{searchQuery}&quot;.</CommandEmpty>
                        )}
                      </CommandGroup>
                    )}

                    {!isLoading && !fetchError && components.length === 0 && tags.length === 0 && (
                      <CommandEmpty>No components or categories available.</CommandEmpty>
                    )}
                  </>
                )}
              </CommandList>
            </div>

            {/* Right Pane: Preview */}
            <div className="w-1/2 p-4 flex flex-col items-center justify-center bg-muted/10">
              {hoveredComponent ? (
                <>
                  <h3 className="text-lg font-semibold mb-3 text-center">{hoveredComponent.name}</h3>
                    <div className="relative w-full aspect-video border rounded-md overflow-hidden bg-background shadow-sm mb-2">
                      <Image
                        src={hoveredComponent.previewImageUrl}
                        alt={`Preview of ${hoveredComponent.name}`}
                        layout="fill"
                        objectFit="contain"
                        unoptimized={hoveredComponent.previewImageUrl.startsWith("/")}
                        onError={(e) => {
                          // Fallback to placeholder if the image fails to load
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-image.svg';
                        }}
                      />
                    </div>
                  <p className="text-xs text-muted-foreground mt-1 text-center">
                    Tags: {hoveredComponent.tags.join(", ")}
                  </p>
                </>
              ) : (
                <div className="text-center text-muted-foreground p-4">
                  <SearchIcon className="mx-auto h-10 w-10 mb-3 opacity-50" />
                  <p className="text-sm font-medium">Component Preview</p>
                  <p className="text-xs mt-1">
                    {isLoading ? "Loading components..." : 
                     fetchError ? "Error loading previews." : 
                     components.length === 0 ? "No components loaded." :
                     "Hover over a component to see its preview."}
                  </p>
                </div>
              )}
            </div>
          </div>
          {/* Footer: flex-shrink-0 ensures it doesn't get pushed out by flex-grow content */}
          <div className="border-t px-4 py-4 text-sm text-muted-foreground flex-shrink-0">
            swiftblocs
          </div>
        </div>
      </CommandDialog>
    </>
  );
}
