/**
 * Interface for a SwiftBlocs component
 */
export interface Component {
  id: string;
  author: string;
  component_title: string;
  description: string;
  views_count: number;
  bookmarks_count: number;
  image_storage_path: string;
  image_file_name: string;
  tags: string[];
  code: string;
  created_at: string;
  imageUrl?: string;
}

/**
 * Props for the ComponentCard component
 */
export interface ComponentCardProps {
  id?: string;
  componentTitle: string;
  author?: string;
  viewsCount: number;
  bookmarksCount: number;
  imageUrl: string;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showEditDelete?: boolean;
}

/**
 * Props for the ComponentForm component
 */
export interface ComponentFormProps {
  componentTitle: string;
  setComponentTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
  tags: Array<{ value: string; label: string }>;
}
