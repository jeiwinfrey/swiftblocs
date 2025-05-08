import React from 'react';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { LucideIcon } from 'lucide-react';

interface SidebarMenuItemProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
}

export function SidebarMenuItem({ icon: Icon, label, onClick }: SidebarMenuItemProps) {
  return (
    <SidebarMenuButton 
      asChild 
      style={{ 
        padding: '8px', 
        marginBottom: '2px' 
      }}
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5" />
        <span>{label}</span>
      </div>
    </SidebarMenuButton>
  );
}
