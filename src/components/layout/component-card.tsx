import { Card } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { BookmarkIcon, EyeIcon } from "lucide-react"
import Image from "next/image"

interface ComponentCardProps {
    componentTitle?: string;
    authorAvatar?: string;
    viewsCount?: number;
    bookmarksCount?: number;
    imageUrl?: string;
    className?: string;
}

export function ComponentCard({
    componentTitle = "Component Title",
    authorAvatar = "",
    viewsCount = 0,
    bookmarksCount = 0,
    imageUrl = "",
    className = "",
}: ComponentCardProps = {}) {
    return (
        <Card variant="inner" className={`max-w-[400px] bg-background overflow-hidden rounded-md ${className}`}>
            {/* Component Preview Image */}
            <div className="relative w-full h-40 bg-muted rounded-sm">
                {imageUrl ? (
                    <Image 
                        src={imageUrl} 
                        alt={componentTitle} 
                        fill
                        className="object-cover rounded-sm"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        Component Preview
                    </div>
                )}
            </div>
            
            {/* Component Info */}
            <div>
                {/* Author, Views and Bookmarks */}
                <div className="pt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Avatar className="size-8">
                            {authorAvatar ? (
                                <AvatarImage src={authorAvatar} alt={componentTitle} />
                            ) : (
                                <AvatarFallback className="text-xs">
                                    {componentTitle.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            )}
                        </Avatar>
                        <span className="text-xs text-muted-foreground truncate max-w-[100px]">{componentTitle}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                            <EyeIcon className="size-3.5 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{viewsCount}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <BookmarkIcon className="size-3.5 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{bookmarksCount}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    )
}
