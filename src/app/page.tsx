"use client"

import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { AppHeader } from "@/components/layout/app-header"
import { ComponentCard } from "@/components/layout/component-card";

export default function Page() {
  return (
    <SidebarProvider>
      <div style={{ display: "flex", width: "100%", height: "100vh", overflow: "hidden" }}>
        <AppSidebar />
        <AppHeader />
      </div>
    </SidebarProvider>
  );
}
