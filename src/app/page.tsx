'use client';

import { useAppStore } from '../store/useAppStore';

export default function Home() {
  const { count, increment, decrement } = useAppStore();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <h1 className="text-4xl font-bold">SwiftBlocs App is working!</h1>
      
      <div className="flex flex-col items-center gap-4">
        <p className="text-2xl">Counter: {count}</p>
        <div className="flex gap-4">
          <button 
            onClick={decrement}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Decrement
          </button>
          <button 
            onClick={increment}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Increment
          </button>
        </div>
      </div>
    </div>
  );
}
