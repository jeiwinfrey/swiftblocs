"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/auth/auth-provider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

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
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{user?.email || 'User'}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
