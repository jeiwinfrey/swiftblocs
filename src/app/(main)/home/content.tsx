"use client"

export default function HomeContent() {
  return (
    <div className="h-full w-full">
      {/* This div takes up all available space in the bottom right */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Add your content here */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold">Card Title 1</h3>
          <p className="text-sm text-muted-foreground">Some content here...</p>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold">Card Title 2</h3>
          <p className="text-sm text-muted-foreground">Some content here...</p>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold">Card Title 3</h3>
          <p className="text-sm text-muted-foreground">Some content here...</p>
        </div>
      </div>
    </div>
  )
}
