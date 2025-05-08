import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar"

import { SidebarMenuItem } from './sidebar-menu-item'

import { Home, Blocks, UsersRound, Bookmark, FileBox } from "lucide-react"

  
  export function AppSidebar() {
    return (
      <Sidebar style={{ borderRight: '1px solid var(--sidebar-border)' }}>
        <SidebarHeader style={{ padding: '8px', borderBottom: '1px solid var(--sidebar-border)' }}>
          <div style={{ padding: '4px 8px 8px 8px' }}>
            <span>swiftblocs</span>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup style={{ padding: '8px 8px 8px 12px' }}>
          <SidebarGroupLabel><p>Browse</p></SidebarGroupLabel>
            <SidebarMenuItem icon={Home} label="Home" />
            <SidebarMenuItem icon={Blocks} label="Components" />
            <SidebarMenuItem icon={UsersRound} label="Creators" />
          </SidebarGroup>

          <SidebarGroup style={{ padding: '8px 8px 8px 12px' }}>
          <SidebarGroupLabel><p>You</p></SidebarGroupLabel>
            <SidebarMenuItem icon={FileBox} label="Submissions" />
            <SidebarMenuItem icon={Bookmark} label="Bookmarks" />
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter style={{ borderTop: '1px solid var(--sidebar-border)', padding: '8px' }}>
              <div style={{ padding: '8px 16px 8px 8px' }}>
                <p style={{ fontSize: '0.75rem', textAlign: 'center' }}>made by jeiwinfrey.</p>
              </div>
        </SidebarFooter>
      </Sidebar>
    )
  }
  