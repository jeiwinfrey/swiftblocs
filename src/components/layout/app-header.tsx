"use client"

import * as React from "react"
import { useSidebar, SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserAvatar } from "@/components/layout/user-avatar"
import { ContentRouter } from "./routing"
import Link from "next/link"
import { useAuth } from "@/components/auth/auth-provider"
import { ComponentSearchBar } from "../layout/searchbar"

export function AppHeader() {
  const { user } = useAuth();
  const isLoggedIn = !!user;
  const { setActiveItem } = useSidebar();
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "j" && (e.metaKey || e.ctrlKey)) || (e.key === "k" && (e.metaKey || e.ctrlKey))) {
        e.preventDefault()
        setIsSearchOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, []);
  
  return (  
    <main 
      style={{ 
        flex: 1, 
        display: "flex", 
        flexDirection: "column", 
        minWidth: 0, 
        overflow: "auto",
        transition: "all 0.2s ease-in-out",
      }}
    >
      <div style={{ borderBottom: "1px solid var(--sidebar-border)", padding: "2px", width: "100%" }}>
        <div style={{ padding: "4px 8px 8px 8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div className="flex items-center gap-1" style={{ flexGrow: 1 }}>
            <SidebarTrigger />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "400px", height: "32px", maxWidth: "100%", margin: "0 auto" }}>
              <Button 
                variant="outline" 
                style={{ width: "100%", height: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", paddingLeft: "12px", paddingRight: "8px" }}
                onClick={() => setIsSearchOpen(true)}
              >
                <span className="text-xs">Global search...</span>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  <span className="text-xs">⌘</span>J
                </kbd>
              </Button>
            </div>
            <ThemeToggle />
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setActiveItem("publish")}
                >
                  Add New
                </Button>
                <UserAvatar />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">Log In</Button>
                </Link>
                <Link href="/signup">
                  <Button variant="secondary" size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <ContentRouter />
      <ComponentSearchBar open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </main>
  );
}
