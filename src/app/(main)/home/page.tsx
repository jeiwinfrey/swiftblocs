import React from 'react';

export default function HomePage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome to SwiftBlocs</h1>
      <p className="mb-4">Your platform for discovering and creating amazing content blocks.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <div className="border rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Discover Components</h2>
          <p>Browse our library of ready-to-use components.</p>
        </div>
        <div className="border rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Meet Creators</h2>
          <p>Connect with talented creators in our community.</p>
        </div>
        <div className="border rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Latest Submissions</h2>
          <p>Check out the newest components submitted by our community.</p>
        </div>
      </div>
    </div>
  );
}
