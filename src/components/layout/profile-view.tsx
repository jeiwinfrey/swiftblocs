'use client';

import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ComponentCard } from "./component-card";
import { ComponentDetails } from "./component-details";
import { Component } from "@/services/supabase/components";

interface ProfileViewProps {
  displayName: string;
  username: string;
  bio: string;
  avatarUrl?: string;
  components: Component[];
  onEditComponent?: (component: Component) => void;
  onDeleteComponent?: (componentId: string) => void;
  showEditDelete?: boolean;
}

export function generateInitials(name: string): string {
  if (!name) return '??';
  const nameParts = name.split(' ');
  const initials = nameParts.length > 1
    ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`
    : nameParts[0].substring(0, 2);
  return initials.toUpperCase();
}

export function ProfileView({
  displayName,
  username,
  bio,
  avatarUrl,
  components,
  onEditComponent,
  onDeleteComponent,
  showEditDelete = false
}: ProfileViewProps) {
  const [selectedComponent, setSelectedComponent] = React.useState<Component | null>(null);
  const [detailsOpen, setDetailsOpen] = React.useState(false);

  return (
    <div className="container mx-auto p-4 space-y-8">
      {/* Profile Header */}
      <div className="flex items-start gap-6">
        <Avatar className="h-24 w-24">
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} alt={displayName} />
          ) : (
            <AvatarFallback className="text-2xl">
              {generateInitials(displayName)}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">{displayName}</h1>
          <p className="text-muted-foreground">@{username}</p>
          <p className="max-w-2xl">{bio}</p>
        </div>
      </div>

      {/* Components Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Published Components</h2>
        {components.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {components.map((component) => (
              <ComponentCard
                key={component.id}
                id={component.id}
                componentTitle={component.component_title}
                author={component.author}
                viewsCount={component.views_count}
                bookmarksCount={component.bookmarks_count}
                imageUrl={component.imageUrl || ''}
                onClick={() => {
                  setSelectedComponent(component);
                  setDetailsOpen(true);
                }}
                onEdit={onEditComponent && showEditDelete ? () => onEditComponent(component) : undefined}
                onDelete={onDeleteComponent && showEditDelete ? () => onDeleteComponent(component.id) : undefined}
                showEditDelete={showEditDelete}
              />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No components published yet.</p>
        )}
      </div>

      {/* Component Details Dialog */}
      <ComponentDetails
        component={selectedComponent}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </div>
  );
}
