import React from 'react';

export default function CreatorsPage() {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder for creator profiles - would be dynamically generated in a real app */}
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="border rounded-lg p-4 shadow-sm flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-muted mb-3 flex items-center justify-center">
              <span className="text-muted-foreground">Avatar</span>
            </div>
            <h3 className="font-medium">Creator {index + 1}</h3>
            <p className="text-sm text-muted-foreground mt-1 text-center">Component designer and developer</p>
            <div className="flex gap-2 mt-3">
              <span className="text-xs px-2 py-1 rounded-full bg-muted">42 Components</span>
              <span className="text-xs px-2 py-1 rounded-full bg-muted">1.2k Followers</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
