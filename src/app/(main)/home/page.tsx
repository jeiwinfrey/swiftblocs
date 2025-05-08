"use client"

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div style={{ display: "flex", width: "100%", height: "100vh", overflow: "hidden" }}>
        <AppSidebar />
        <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "auto" }}>
          <div style={{ borderBottom: "1px solid var(--sidebar-border)", padding: "8px", width: "100%" }}>
            <div style={{ padding: "4px 8px 8px 8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div className="flex items-center gap-2">
                <SidebarTrigger />
                <Button variant="secondary">Global search...</Button>
              </div>
              <ThemeToggle />
            </div>
          </div>
          <div style={{ flex: 1, overflow: "auto", padding: "16px" }}>
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
