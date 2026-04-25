export interface MediaItem {
  id: string;
  title: string;
  file_url: string;
  file_type: "image" | "video";
  alt_text: string;
  caption: string;
  bucket: string;
  path: string;
  size: number;
  mime_type: string | null;
  created_at: string;
  uploaded_by: string | null;
}

export type MediaFilter = "all" | "image" | "video";
