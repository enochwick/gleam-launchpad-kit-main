/**
 * MediaPicker — embed this anywhere you need to select from the media library.
 *
 * Usage:
 *   <MediaPicker
 *     trigger={<Button>Choose image</Button>}
 *     onSelect={(item) => setHeroImage(item.file_url)}
 *     filter="image"
 *   />
 *
 * The media_library table has public read RLS, so this works without auth.
 */
import { useEffect, useState } from "react";
import { Search, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { MediaItem, MediaFilter } from "@/types/media";

interface Props {
  /** The element that opens the picker when clicked */
  trigger: React.ReactNode;
  /** Called with the chosen MediaItem */
  onSelect: (item: MediaItem) => void;
  /** Restrict visible items to images or videos */
  filter?: MediaFilter;
  /** Currently selected URL — highlights that card */
  selectedUrl?: string;
  title?: string;
}

export const MediaPicker = ({
  trigger,
  onSelect,
  filter = "all",
  selectedUrl,
  title = "Choose from Media Library",
}: Props) => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    let q = supabase
      .from("media_library")
      .select("*")
      .order("created_at", { ascending: false });
    if (filter !== "all") q = q.eq("file_type", filter);
    q.then(({ data }) => {
      if (data) setItems(data as MediaItem[]);
      setLoading(false);
    });
  }, [open, filter]);

  const filtered = items.filter((i) =>
    i.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (item: MediaItem) => {
    onSelect(item);
    setOpen(false);
  };

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => e.key === "Enter" && setOpen(true)}
      >
        {trigger}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">{title}</DialogTitle>
          </DialogHeader>

          {/* Search */}
          <div className="flex items-center gap-2 bg-foreground/5 border border-border rounded-full px-4 py-2 mb-4">
            <Search className="w-4 h-4 text-foreground/40 shrink-0" />
            <input
              placeholder="Search by title…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-foreground/40"
            />
          </div>

          {loading ? (
            <div className="text-center py-20 text-foreground/40 text-sm">
              Loading…
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-foreground/40 text-sm">
              {search ? `No results for "${search}"` : "No media uploaded yet."}
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-[55vh] overflow-y-auto pr-1 pb-1">
              {filtered.map((item) => {
                const isSelected = item.file_url === selectedUrl;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    title={item.title}
                    className={`group relative rounded-xl overflow-hidden card-glow transition-colors focus-visible:ring-2 focus-visible:ring-primary ${
                      isSelected ? "ring-2 ring-primary" : "hover:border-primary/40"
                    }`}
                  >
                    <div className="aspect-square bg-foreground/5 relative">
                      {item.file_type === "image" ? (
                        <img
                          src={item.file_url}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-foreground/30 text-[10px] font-mono uppercase tracking-wider">
                          Video
                        </div>
                      )}
                      {isSelected && (
                        <div className="absolute inset-0 bg-primary/30 flex items-center justify-center">
                          <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-white" />
                          </div>
                        </div>
                      )}
                      {!isSelected && (
                        <div className="absolute inset-0 bg-primary/15 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                    <div className="px-2 py-1.5">
                      <p className="text-[10px] truncate text-foreground/60 leading-snug">
                        {item.title}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
