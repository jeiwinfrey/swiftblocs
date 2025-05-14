"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/auth/auth-provider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { Settings, LogOut } from "lucide-react"
import Link from "next/link"

export function UserAvatar() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  
  const handleSignOut = async () => {
    await signOut();
    router.push('/');
    router.refresh();
  };
  
  // Get the first letter of the email for the avatar fallback
  const fallbackText = user?.email ? user.email[0].toUpperCase() : 'U';
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="outline-2 outline-primary cursor-pointer">
          <AvatarImage src={user?.user_metadata?.avatar_url || ''} />
          <AvatarFallback>{fallbackText}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.user_metadata?.username || user?.email?.split('@')[0] || 'User'}</p>
            <p className="text-xs leading-none text-muted-foreground">{user?.email || ''}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href="/account-settings">
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
