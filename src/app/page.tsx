"use client"

import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { MainContent } from "@/components/layout/main-content"

export default function Page() {
  return (
    <SidebarProvider>
      <div style={{ display: "flex", width: "100%", height: "100vh", overflow: "hidden" }}>
        <AppSidebar />
        <MainContent />
      </div>
    </SidebarProvider>
  );
}
