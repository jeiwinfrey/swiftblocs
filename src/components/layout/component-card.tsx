import { Card } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { BookmarkIcon, EyeIcon } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

interface ComponentCardProps {
    componentTitle: string;
    author?: string;
    authorAvatar?: string;
    viewsCount?: number;
    bookmarksCount?: number;
    imageUrl?: string;
    className?: string;
}

export const ComponentCard: React.FC<ComponentCardProps> = ({
    componentTitle = "Component Title",
    author = "",
    authorAvatar = "",
    viewsCount = 0,
    bookmarksCount = 0,
    imageUrl = "",
    className = "",
}) => {
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null); 
    const [authorInitials, setAuthorInitials] = useState<string>("");

    useEffect(() => {
        const fetchOrUseAvatar = async () => {
            if (authorAvatar) {
                if (authorAvatar.startsWith('http')) {
                    try {
                        const response = await fetch(authorAvatar);
                        if (response.ok) {
                            setAvatarUrl(authorAvatar);
                            setAuthorInitials("");
                            return; 
                        } else {
                            setAvatarUrl(null); 
                        }
                    } catch {
                        setAvatarUrl(null); 
                    }
                }
            }

            if (!author) {
                setAuthorInitials('??');
                setAvatarUrl(null);
                return;
            }

            const { data: publicUrlData } = supabase.storage
                .from('avatars')
                .getPublicUrl(`${author}-avatar.png`);

            if (publicUrlData && publicUrlData.publicUrl) {
                try {
                    const response = await fetch(publicUrlData.publicUrl);
                    if (response.ok) {
                        setAvatarUrl(publicUrlData.publicUrl);
                        setAuthorInitials("");
                    } else {
                        setAvatarUrl(null);
                        const nameParts = author.split(' ');
                        const initials = nameParts.length > 1
                          ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`
                          : nameParts[0].substring(0, 2);
                        setAuthorInitials(initials.toUpperCase());
                    }
                } catch {
                    setAvatarUrl(null);
                    const nameParts = author.split(' ');
                    const initials = nameParts.length > 1
                      ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`
                      : nameParts[0].substring(0, 2);
                    setAuthorInitials(initials.toUpperCase());
                }
            } else {
                setAvatarUrl(null);
                const nameParts = author.split(' ');
                const initials = nameParts.length > 1
                  ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`
                  : nameParts[0].substring(0, 2);
                setAuthorInitials(initials.toUpperCase());
            }
        };

        fetchOrUseAvatar();
    }, [author, authorAvatar]); 

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
                            {avatarUrl ? (
                                <AvatarImage src={avatarUrl} alt={author || componentTitle} />
                            ) : (
                                <AvatarFallback className="text-xs">
                                    {authorInitials || (author ? author.slice(0, 2).toUpperCase() : componentTitle.slice(0, 2).toUpperCase())}
                                </AvatarFallback>
                            )}
                        </Avatar>
                        <span className="text-xs text-muted-foreground truncate max-w-[100px]">{author || componentTitle}</span>
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
