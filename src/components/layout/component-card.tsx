import { Card } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { BookmarkIcon, EyeIcon } from "lucide-react"
import Image from "next/image"

interface ComponentCardProps {
    title?: string;
    authorName?: string;
    authorAvatar?: string;
    viewsCount?: number;
    bookmarksCount?: number;
    imageUrl?: string;
    className?: string;
}

export function ComponentCard({
    title = "Component Title",
    authorName = "Creator Name",
    authorAvatar = "",
    viewsCount = 0,
    bookmarksCount = 0,
    imageUrl = "",
    className = "",
}: ComponentCardProps = {}) {
    return (
        <Card variant="inner" className={`max-w-[400px] bg-background overflow-hidden ${className}`}>
            {/* Component Preview Image */}
            <div className="relative w-full h-40 bg-muted">
                {imageUrl ? (
                    <Image 
                        src={imageUrl} 
                        alt={title} 
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        Component Preview
                    </div>
                )}
            </div>
            
            {/* Component Info */}
            <div>
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-sm truncate">{title}</h3>
                </div>
                
                {/* Author, Views and Bookmarks */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Avatar className="size-6">
                            {authorAvatar ? (
                                <AvatarImage src={authorAvatar} alt={authorName} />
                            ) : (
                                <AvatarFallback className="text-xs">
                                    {authorName.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            )}
                        </Avatar>
                        <span className="text-xs text-muted-foreground truncate max-w-[100px]">{authorName}</span>
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
