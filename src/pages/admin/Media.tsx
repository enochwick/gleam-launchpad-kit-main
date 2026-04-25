import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp, LayoutGrid, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useMediaLibrary, formatBytes } from "@/hooks/useMediaLibrary";
import { MediaUploader } from "@/components/media/MediaUploader";
import { MediaCard } from "@/components/media/MediaCard";
import { MediaEditModal } from "@/components/media/MediaEditModal";
import { MediaPreviewModal } from "@/components/media/MediaPreviewModal";
import { MediaItem, MediaFilter } from "@/types/media";
import { toast } from "@/components/ui/sonner";

const FILTER_TABS: { id: MediaFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "image", label: "Images" },
  { id: "video", label: "Videos" },
];

const AdminMedia = () => {
  const { user } = useAuth();
  const { items, loading, fetchItems, uploadFile, updateItem, removeItem } =
    useMediaLibrary();

  const [filter, setFilter] = useState<MediaFilter>("all");
  const [search, setSearch] = useState("");
  const [uploaderOpen, setUploaderOpen] = useState(true);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [editItem, setEditItem] = useState<MediaItem | null>(null);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleUpload = async (file: File) => {
    await uploadFile(file);
    toast.success(`"${file.name.replace(/\.[^/.]+$/, "")}" uploaded`);
  };

  const handleDelete = async (item: MediaItem) => {
    if (!window.confirm(`Delete "${item.title}"? This cannot be undone.`)) return;
    try {
      await removeItem(item);
      toast.success("Media deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleCopy = async (url: string) => {
    await navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard");
  };

  const handleSave = async (
    id: string,
    patch: Partial<Pick<MediaItem, "title" | "alt_text" | "caption">>
  ) => {
    await updateItem(id, patch);
    toast.success("Changes saved");
  };

  // Derived counts for the stats bar
  const imageCount = items.filter((i) => i.file_type === "image").length;
  const videoCount = items.filter((i) => i.file_type === "video").length;
  const totalSize = items.reduce((acc, i) => acc + i.size, 0);

  const filtered = items
    .filter((i) => filter === "all" || i.file_type === filter)
    .filter((i) => i.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="absolute inset-0 dot-bg pointer-events-none opacity-30" />

      {/* Header */}
      <header className="relative border-b border-foreground/10 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-2.5">
            <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-full border border-primary/40">
              <span className="absolute inset-1 rounded-full border border-primary/60" />
              <span className="absolute bottom-0 right-0 h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
            </span>
            <span className="font-display text-lg font-semibold">Healthview</span>
          </div>
          <span className="text-foreground/25">·</span>
          <Link
            to="/dashboard"
            className="text-foreground/50 hover:text-foreground transition-colors"
          >
            Dashboard
          </Link>
          <span className="text-foreground/25">/</span>
          <span className="text-foreground/80">Media Library</span>
        </div>
        <span className="text-sm text-foreground/45 hidden sm:block">{user?.email}</span>
      </header>

      <div className="relative max-w-7xl mx-auto px-6 py-10">
        {/* Page heading */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <span className="pill-eyebrow mb-3">Media Library</span>
            <h1 className="font-display text-4xl mt-4">Site Media</h1>
            {!loading && items.length > 0 && (
              <p className="text-sm text-foreground/45 mt-2 font-mono">
                {items.length} {items.length === 1 ? "item" : "items"}
                {imageCount > 0 && ` · ${imageCount} image${imageCount !== 1 ? "s" : ""}`}
                {videoCount > 0 && ` · ${videoCount} video${videoCount !== 1 ? "s" : ""}`}
                {` · ${formatBytes(totalSize)}`}
              </p>
            )}
          </div>
          <button
            onClick={() => setUploaderOpen((o) => !o)}
            className="flex items-center gap-1.5 text-sm text-foreground/55 hover:text-foreground transition-colors shrink-0 mt-1"
          >
            {uploaderOpen ? (
              <>
                <ChevronUp className="w-4 h-4" /> Hide uploader
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" /> Upload files
              </>
            )}
          </button>
        </div>

        {/* Upload zone */}
        {uploaderOpen && (
          <div className="card-glow rounded-2xl p-6 mb-8">
            <MediaUploader onUpload={handleUpload} />
          </div>
        )}

        {/* Filter tabs + search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex gap-1 bg-foreground/5 p-1 rounded-full w-fit">
            {FILTER_TABS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  filter === f.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground/60 hover:text-foreground"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-1 max-w-xs bg-foreground/5 border border-border rounded-full px-4 py-2">
            <Search className="w-4 h-4 text-foreground/40 shrink-0" />
            <input
              placeholder="Search by title…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-foreground/40"
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-36">
            <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-36">
            <LayoutGrid className="w-12 h-12 mx-auto mb-4 text-foreground/15" />
            <p className="text-foreground/45 text-sm">
              {search
                ? `No media matching "${search}"`
                : items.length === 0
                ? "No media yet — upload your first file above"
                : `No ${filter === "all" ? "" : filter + " "}files found`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filtered.map((item) => (
              <MediaCard
                key={item.id}
                item={item}
                onPreview={setPreviewItem}
                onEdit={setEditItem}
                onDelete={handleDelete}
                onCopy={handleCopy}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <MediaPreviewModal
        item={previewItem}
        onClose={() => setPreviewItem(null)}
        onEdit={(item) => {
          setPreviewItem(null);
          setEditItem(item);
        }}
        onDelete={(item) => {
          setPreviewItem(null);
          handleDelete(item);
        }}
      />

      <MediaEditModal
        item={editItem}
        onClose={() => setEditItem(null)}
        onSave={handleSave}
      />
    </div>
  );
};

export default AdminMedia;
