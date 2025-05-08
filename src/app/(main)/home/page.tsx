"use client"

import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from "react"

function MainContent({ children }: { children: React.ReactNode }) {
  const { open, activeItem } = useSidebar();
  const [isLoggedIn] = useState(true); // Set to false or true
  
  return (
    <main 
      style={{ 
        flex: 1, 
        display: "flex", 
        flexDirection: "column", 
        minWidth: 0, 
        overflow: "auto",
        transition: "all 0.2s ease-in-out",
        paddingLeft: !open ? "0.5rem" : "0",
        paddingRight: !open ? "1rem" : "0.5rem"
      }}
    >
      <div style={{ borderBottom: "1px solid var(--sidebar-border)", padding: "2px", width: "100%" }}>
        <div style={{ padding: "4px 8px 8px 8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div className="flex items-center gap-2" style={{ flexGrow: 1 }}>
            <SidebarTrigger />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "400px", height: "32px", maxWidth: "100%", margin: "0 auto" }}>
              <Button variant="outline" style={{ width: "100%", height: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", paddingLeft: "12px", paddingRight: "8px" }}>
                <span className="text-xs">Global search...</span>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  <span className="text-xs">⌘</span>J
                </kbd>
              </Button>
            </div>
            <ThemeToggle />
            {isLoggedIn ? (
              <Avatar className="outline-2 outline-ring">
                <AvatarImage src="https://github.com/jeiwinfrey" />
                <AvatarFallback>J</AvatarFallback>
              </Avatar>
            ) : (
              <div>
                <Button variant="secondary" size="sm">Sign Up</Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div style={{ flex: 1, overflow: "auto", padding: "16px" }}>
        {(activeItem === "home" && <div>Welcome to swiftblocs!</div>) ||
          (activeItem === "components" && <div>Components page</div>) ||
          (activeItem === "creators" && <div>Creators page</div>) ||
          (activeItem === "submissions" && <div>Submissions page</div>) ||
          (activeItem === "bookmarks" && <div>Bookmarks page</div>) ||
          <div>Content not found</div>
        }
      </div>
    </main>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div style={{ display: "flex", width: "100%", height: "100vh", overflow: "hidden" }}>
        <AppSidebar />
        <MainContent>{children}</MainContent>
      </div>
    </SidebarProvider>
  );
}
