import React from 'react';

export default function ComponentsPage() {
  return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder for component cards - would be dynamically generated in a real app */}
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="border rounded-lg p-4 shadow-sm">
            <div className="h-40 bg-muted rounded-md mb-3 flex items-center justify-center">
              <span className="text-muted-foreground">Component Preview</span>
            </div>
            <h3 className="font-medium">Component {index + 1}</h3>
            <p className="text-sm text-muted-foreground mt-1">A versatile UI component for your application</p>
            <div className="flex gap-2 mt-3">
              <span className="text-xs px-2 py-1 rounded-full bg-muted">React</span>
              <span className="text-xs px-2 py-1 rounded-full bg-muted">UI</span>
            </div>
          </div>
        ))}
      </div>
  );
}
