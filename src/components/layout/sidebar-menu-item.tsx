import React from 'react';
import { SidebarMenuButton, useSidebar } from '@/components/ui/sidebar';
import { LucideIcon } from 'lucide-react';

interface SidebarMenuItemProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  isActive?: boolean;
  value?: string;
}

export function SidebarMenuItem({ icon: Icon, label, onClick, isActive, value }: SidebarMenuItemProps) {
  const { setOpen, activeItem, setActiveItem } = useSidebar();
  
  // Check if this menu item is active based on the sidebar state
  const active = isActive !== undefined ? isActive : activeItem === value?.toLowerCase();
  
  const handleClick = () => {
    // If value is provided, update the sidebar state
    if (value) {
      // We're using setOpen to keep the sidebar open, but we could also use a different state management approach
      setOpen(true);
      // Update the active item in the sidebar context
      setActiveItem(value.toLowerCase());
    }
    
    // Call the original onClick handler if provided
    if (onClick) onClick();
  };
  
  return (
    <SidebarMenuButton 
      asChild 
      isActive={active}
      style={{ 
        padding: '8px', 
        marginBottom: '2px' 
      }}
      onClick={handleClick}
    >
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5" />
        <span>{label}</span>
      </div>
    </SidebarMenuButton>
  );
}
