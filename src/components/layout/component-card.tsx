import { Card } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { BookmarkIcon, EyeIcon } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

interface ComponentCardProps {
    componentTitle?: string;
    author?: string;
    authorAvatar?: string;
    viewsCount?: number;
    bookmarksCount?: number;
    imageUrl?: string;
    className?: string;
}

export function ComponentCard({
    componentTitle = "Component Title",
    author = "",
    authorAvatar = "",
    viewsCount = 0,
    bookmarksCount = 0,
    imageUrl = "",
    className = "",
}: ComponentCardProps = {}) {
    const [avatarUrl, setAvatarUrl] = useState(authorAvatar);
    const [authorInitials, setAuthorInitials] = useState("");
    
    // Fetch author's avatar from user metadata if not provided
    useEffect(() => {
        async function fetchAuthorAvatar() {
            if (!author) return;
            
            try {
                // Get the user data by username
                const { data: userData, error } = await supabase
                    .from('users')
                    .select('id, metadata')
                    .eq('username', author)
                    .single();
                
                if (error) {
                    console.log('Error fetching user data:', error);
                    throw error;
                }
                
                if (userData?.metadata?.avatar_url) {
                    // Add a cache-busting parameter to force refresh
                    const cacheBuster = `?t=${Date.now()}`;
                    setAvatarUrl(userData.metadata.avatar_url + cacheBuster);
                    return;
                }
                
                // Direct approach - try to get the latest avatar from storage
                // This is a fallback if the metadata approach doesn't work
                const { data: publicUrlData } = supabase.storage
                    .from('avatars')
                    .getPublicUrl(`${author}-avatar.png`);
                
                if (publicUrlData?.publicUrl) {
                    const cacheBuster = `?t=${Date.now()}`;
                    setAvatarUrl(publicUrlData.publicUrl + cacheBuster);
                    return;
                }
                
                // If no avatar found, set initials
                setAuthorInitials(author.slice(0, 2).toUpperCase());
            } catch (err) {
                console.error('Error fetching author avatar:', err);
                setAuthorInitials(author.slice(0, 2).toUpperCase());
            }
        }
        
        if (!avatarUrl) {
            fetchAuthorAvatar();
        }
    }, [author, avatarUrl]);
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
