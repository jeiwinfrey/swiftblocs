import { Card } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { BookmarkIcon, EyeIcon } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { ComponentCardProps } from "@/types/component"

/**
 * Generates initials from a name
 * @param name The name to generate initials from
 * @returns The initials
 */
function generateInitials(name: string): string {
  if (!name) return '??';
  
  const nameParts = name.split(' ');
  const initials = nameParts.length > 1
    ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`
    : nameParts[0].substring(0, 2);
  return initials.toUpperCase();
}

export const ComponentCard: React.FC<ComponentCardProps> = ({
    componentTitle = "Component Title",
    author = "",
    viewsCount = 0,
    bookmarksCount = 0,
    imageUrl = "",
    onClick, // Will be used for navigation to component details
}) => {
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null); 
    const [authorInitials, setAuthorInitials] = useState<string>("");

    useEffect(() => {
        const fetchAvatar = async () => {
            if (!author) {
                setAuthorInitials('??');
                setAvatarUrl(null);
                return;
            }

            // Try to get avatar from Supabase storage
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
                        setAuthorInitials(generateInitials(author));
                    }
                } catch {
                    setAvatarUrl(null);
                    setAuthorInitials(generateInitials(author));
                }
            } else {
                setAvatarUrl(null);
                setAuthorInitials(generateInitials(author));
            }
        };

        fetchAvatar();
    }, [author]); 

    return (
        <Card 
            variant="inner" 
            className="max-w-[400px] bg-background overflow-hidden rounded-md"
            onClick={onClick}
        >
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
