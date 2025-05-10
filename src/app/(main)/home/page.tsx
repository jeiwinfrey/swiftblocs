import React from 'react';
import { ComponentCard } from "@/components/layout/component-card";

export default function HomePage() {
  // Sample component data
  const sampleComponents = [
    {
      componentTitle: "Animated Button",
      viewsCount: 1254,
      bookmarksCount: 87,
      imageUrl: "/samples/component1.jpg"
    },
    {
      componentTitle: "Responsive Card Grid",
      viewsCount: 843,
      bookmarksCount: 62,
      imageUrl: "/samples/component2.jpg"
    },
    {
      componentTitle: "Navigation Menu",
      viewsCount: 1876,
      bookmarksCount: 124,
      imageUrl: "/samples/component3.jpg"
    },
    {
      componentTitle: "Form Input Group",
      viewsCount: 632,
      bookmarksCount: 41,
      imageUrl: "/samples/component4.jpg"
    },
    {
      componentTitle: "Modal Dialog",
      viewsCount: 1432,
      bookmarksCount: 93,
      imageUrl: "/samples/component5.jpg"
    },
    {
      componentTitle: "Data Table",
      viewsCount: 2145,
      bookmarksCount: 156,
      imageUrl: "/samples/component6.jpg"
    }
  ];

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {sampleComponents.map((component, index) => (
          <ComponentCard 
            key={index}
            componentTitle={component.componentTitle}
            viewsCount={component.viewsCount}
            bookmarksCount={component.bookmarksCount}
            imageUrl={component.imageUrl}
          />
        ))}
      </div>
    </div>
  );
}
