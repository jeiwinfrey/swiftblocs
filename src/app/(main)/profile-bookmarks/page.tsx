import React from 'react';

export default function BookmarksPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Bookmarks</h1>
      <p className="mb-6">Components and creators you've saved for later.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder for bookmarked items - would be dynamically generated in a real app */}
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="border rounded-lg p-4 shadow-sm">
            <div className="h-40 bg-muted rounded-md mb-3 flex items-center justify-center">
              <span className="text-muted-foreground">Bookmarked Item</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Bookmark {index + 1}</h3>
              <button className="text-xs">Remove</button>
            </div>
            <p className="text-sm text-muted-foreground">Created by Creator {index + 1}</p>
            <p className="text-xs text-muted-foreground mt-1">Bookmarked 5 days ago</p>
            <div className="flex gap-2 mt-3">
              <span className="text-xs px-2 py-1 rounded-full bg-muted">React</span>
              <span className="text-xs px-2 py-1 rounded-full bg-muted">UI</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
