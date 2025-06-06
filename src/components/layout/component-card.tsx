import { Card } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { BookmarkIcon, EyeIcon, Pencil, Trash2, AlertCircle } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { ComponentCardProps } from "@/types/component"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

// Generates initials from a name
function generateInitials(name: string): string {
  if (!name) return '??';
  
  const nameParts = name.split(' ');
  return (nameParts.length > 1
    ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`
    : name.substring(0, 2)
  ).toUpperCase();
}

export const ComponentCard: React.FC<ComponentCardProps> = ({
    componentTitle = "Component Title",
    author = "",
    viewsCount = 0,
    bookmarksCount = 0,
    imageUrl = "",
    onClick, // Will be used for navigation to component details
    onEdit,
    onDelete,
    showEditDelete = false
}) => {
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null); 
    const [authorInitials, setAuthorInitials] = useState<string>("");
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    useEffect(() => {
        async function fetchAvatar() {
            if (!author) {
                setAuthorInitials('??');
                setAvatarUrl(null);
                return;
            }

            // Get avatar URL from Supabase storage
            const { data: publicUrlData } = supabase.storage
                .from('avatars')
                .getPublicUrl(`${author}-avatar.png`);

            if (publicUrlData?.publicUrl) {
                try {
                    const response = await fetch(publicUrlData.publicUrl, { method: 'HEAD' });
                    if (response.ok) {
                        setAvatarUrl(publicUrlData.publicUrl);
                        return;
                    }
                } catch {
                    // Silently handle fetch errors
                }
            }
            
            // Fallback to initials
            setAvatarUrl(null);
            setAuthorInitials(generateInitials(author));
        }

        fetchAvatar();
    }, [author]); 

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onEdit) onEdit();
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowDeleteDialog(true);
    };
    
    const confirmDelete = () => {
        if (onDelete) onDelete();
        setShowDeleteDialog(false);
    };
    
    const cancelDelete = () => {
        setShowDeleteDialog(false);
    };

    return (
        <Card 
            variant="inner" 
            className="max-w-[400px] bg-background overflow-hidden rounded-md relative group"
            onClick={onClick}
        >
            {/* Edit/Delete Buttons - Only visible on hover */}
            {showEditDelete && (
                <div className="absolute inset-0 z-10 flex items-center justify-center gap-3 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button 
                        variant="secondary" 
                        size="icon" 
                        className="h-10 w-10 rounded-full bg-background/90 backdrop-blur-sm shadow-lg hover:scale-110 transition-transform"
                        onClick={handleEdit}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                        variant="destructive" 
                        size="icon" 
                        className="h-10 w-10 rounded-full bg-destructive/90 backdrop-blur-sm shadow-lg hover:scale-110 transition-transform"
                        onClick={handleDeleteClick}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            )}
            
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
                                    {authorInitials}
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
            
            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent onClick={(e) => e.stopPropagation()} className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-destructive">
                            <AlertCircle className="h-5 w-5" />
                            Confirm Deletion
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete &quot;{componentTitle}&quot;? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={cancelDelete}>Cancel</Button>
                        <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    )
}
