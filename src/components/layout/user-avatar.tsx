"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function UserAvatar() {
  return (
    <Avatar className="outline-2 outline-ring">
      <AvatarImage src="https://github.com/jeiwinfrey" />
      <AvatarFallback>J</AvatarFallback>
    </Avatar>
  )
}
