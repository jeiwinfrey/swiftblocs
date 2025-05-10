import React from 'react';
import { ComponentCard } from "@/components/layout/component-card";

export default function HomePage() {
  // Sample component data
  const sampleComponents = [
    {
      title: "Animated Button",
      authorName: "Sarah Chen",
      viewsCount: 1254,
      bookmarksCount: 87,
      imageUrl: "/samples/component1.jpg"
    },
    {
      title: "Responsive Card Grid",
      authorName: "Michael Wong",
      viewsCount: 843,
      bookmarksCount: 62,
      imageUrl: "/samples/component2.jpg"
    },
    {
      title: "Navigation Menu",
      authorName: "Alex Johnson",
      viewsCount: 1876,
      bookmarksCount: 124,
      imageUrl: "/samples/component3.jpg"
    },
    {
      title: "Form Input Group",
      authorName: "Jamie Lee",
      viewsCount: 632,
      bookmarksCount: 41,
      imageUrl: "/samples/component4.jpg"
    },
    {
      title: "Modal Dialog",
      authorName: "Chris Taylor",
      viewsCount: 1432,
      bookmarksCount: 93,
      imageUrl: "/samples/component5.jpg"
    },
    {
      title: "Data Table",
      authorName: "Pat Smith",
      viewsCount: 2145,
      bookmarksCount: 156,
      imageUrl: "/samples/component6.jpg"
    }
  ];

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {sampleComponents.map((component, index) => (
          <ComponentCard 
            key={index}
            title={component.title}
            authorName={component.authorName}
            viewsCount={component.viewsCount}
            bookmarksCount={component.bookmarksCount}
            imageUrl={component.imageUrl}
          />
        ))}
      </div>
    </div>
  );
}
