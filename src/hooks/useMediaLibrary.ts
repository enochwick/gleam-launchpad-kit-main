import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { MediaItem } from "@/types/media";

const IMAGE_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
]);
const VIDEO_MIME = new Set(["video/mp4", "video/quicktime", "video/webm"]);

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;   // 10 MB
const MAX_VIDEO_BYTES = 100 * 1024 * 1024;  // 100 MB

export const ACCEPTED_MIME = [...IMAGE_MIME, ...VIDEO_MIME].join(",");

export function formatBytes(b: number): string {
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1048576).toFixed(1)} MB`;
}

function sanitizeName(name: string): string {
  return name.replace(/[^a-zA-Z0-9.\-_]/g, "_").toLowerCase();
}

export function validateFile(file: File): string | null {
  const isImage = IMAGE_MIME.has(file.type);
  const isVideo = VIDEO_MIME.has(file.type);

  if (!isImage && !isVideo) {
    return `Unsupported type. Accepted: JPG, PNG, GIF, WebP, SVG, MP4, MOV, WebM.`;
  }

  const maxBytes = isImage ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES;
  const maxLabel = isImage ? "10 MB" : "100 MB";

  if (file.size > maxBytes) {
    return `${file.name} is too large (${formatBytes(file.size)}). Max ${maxLabel} for ${isImage ? "images" : "videos"}.`;
  }

  return null;
}

export function useMediaLibrary() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("media_library")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setItems(data as MediaItem[]);
    setLoading(false);
  }, []);

  const uploadFile = async (file: File): Promise<MediaItem> => {
    const validationError = validateFile(file);
    if (validationError) throw new Error(validationError);

    const isImage = IMAGE_MIME.has(file.type);
    const bucket = isImage ? "site-images" : "site-videos";

    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();
    if (authErr || !user) throw new Error("Not authenticated.");

    const safeName = sanitizeName(file.name);
    const path = `${user.id}/${Date.now()}-${safeName}`;

    const { error: storageErr } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: false, contentType: file.type });
    if (storageErr) throw new Error(storageErr.message);

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(path);

    // Default title: filename without extension, underscores → spaces
    const defaultTitle = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[_-]+/g, " ");

    const { data: row, error: dbErr } = await supabase
      .from("media_library")
      .insert({
        title: defaultTitle,
        file_url: publicUrl,
        file_type: isImage ? "image" : "video",
        alt_text: "",
        caption: "",
        bucket,
        path,
        size: file.size,
        mime_type: file.type,
        uploaded_by: user.id,
      })
      .select("*")
      .single();

    if (dbErr) {
      // Rollback storage upload on DB failure
      await supabase.storage.from(bucket).remove([path]);
      throw new Error(dbErr.message);
    }

    const item = row as MediaItem;
    setItems((prev) => [item, ...prev]);
    return item;
  };

  const updateItem = async (
    id: string,
    patch: Partial<Pick<MediaItem, "title" | "alt_text" | "caption">>
  ): Promise<MediaItem> => {
    const { data, error } = await supabase
      .from("media_library")
      .update(patch)
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    const updated = data as MediaItem;
    setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
    return updated;
  };

  const removeItem = async (item: MediaItem): Promise<void> => {
    // Delete from storage first; if DB delete fails, storage is cleaned up
    await supabase.storage.from(item.bucket).remove([item.path]);
    const { error } = await supabase
      .from("media_library")
      .delete()
      .eq("id", item.id);
    if (error) throw new Error(error.message);
    setItems((prev) => prev.filter((i) => i.id !== item.id));
  };

  return { items, loading, fetchItems, uploadFile, updateItem, removeItem };
}
