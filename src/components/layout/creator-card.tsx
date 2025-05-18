import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { BookmarkIcon, EyeIcon, CodeIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface CreatorCardProps {
  username: string;
  bio?: string;
  componentCount: number;
  totalViews: number;
  totalBookmarks: number;
  onClick?: () => void;
}

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

export const CreatorCard: React.FC<CreatorCardProps> = ({
  username,
  bio = "SwiftUI component creator",
  componentCount = 0,
  totalViews = 0,
  totalBookmarks = 0,
  onClick,
}) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [initials, setInitials] = useState<string>("");

  useEffect(() => {
    const fetchAvatar = async () => {
      if (!username) {
        setInitials('??');
        setAvatarUrl(null);
        return;
      }

      // Try to get avatar from Supabase storage
      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(`${username}-avatar.png`);

      if (publicUrlData && publicUrlData.publicUrl) {
        try {
          const response = await fetch(publicUrlData.publicUrl);
          if (response.ok) {
            setAvatarUrl(publicUrlData.publicUrl);
            setInitials("");
          } else {
            setAvatarUrl(null);
            setInitials(generateInitials(username));
          }
        } catch {
          setAvatarUrl(null);
          setInitials(generateInitials(username));
        }
      } else {
        setAvatarUrl(null);
        setInitials(generateInitials(username));
      }
    };

    fetchAvatar();
  }, [username]);

  return (
    <Card
      variant="inner"
      className="max-w-[400px] bg-background overflow-hidden rounded-md hover:shadow-md transition-shadow duration-200"
      onClick={onClick}
    >
      <div className="p-4">
        {/* Creator Header */}
        <div className="flex items-center gap-4 mb-3">
          <Avatar className="size-16">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={username} />
            ) : (
              <AvatarFallback className="text-lg">
                {initials || username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{username}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{bio}</p>
          </div>
        </div>
        
        {/* Creator Stats */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-2">
            <CodeIcon className="size-4 text-muted-foreground" />
            <span className="text-sm">{componentCount} Components</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <EyeIcon className="size-4 text-muted-foreground" />
              <span className="text-sm">{totalViews}</span>
            </div>
            <div className="flex items-center gap-1">
              <BookmarkIcon className="size-4 text-muted-foreground" />
              <span className="text-sm">{totalBookmarks}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
