import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { MediaItem } from "@/types/media";

export const MediaShowcase = () => {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("media_library")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setItems(data as MediaItem[]);
        setLoading(false);
      });
  }, []);

  const images = items.filter((i) => i.file_type === "image");
  const videos = items.filter((i) => i.file_type === "video");

  if (!loading && items.length === 0) return null;
  if (loading) return null;

  return (
    <section className="relative py-28 px-6 overflow-hidden">
      <div className="absolute inset-0 dot-bg pointer-events-none opacity-20" />

      <div className="relative max-w-6xl mx-auto">
        {/* Heading */}
        <div className="mb-16 text-center">
          <span className="pill-eyebrow mb-4">Gallery</span>
          <h2 className="font-display text-4xl md:text-5xl mt-4">
            See it in action
          </h2>
          <p className="text-foreground/55 text-sm mt-4 max-w-sm mx-auto leading-relaxed">
            Real-world snapshots from the Healthview platform.
          </p>
        </div>

        {/* Image grid */}
        {images.length > 0 && (
          <div
            className={`grid gap-3 mb-3 ${
              images.length === 1
                ? "grid-cols-1 max-w-2xl mx-auto"
                : images.length === 2
                ? "grid-cols-2"
                : images.length === 3
                ? "grid-cols-2 md:grid-cols-3"
                : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            }`}
          >
            {images.map((item, idx) => (
              <ShowcaseImage
                key={item.id}
                item={item}
                featured={idx === 0 && images.length >= 3}
              />
            ))}
          </div>
        )}

        {/* Video row */}
        {videos.length > 0 && (
          <div
            className={`grid gap-3 ${
              videos.length === 1
                ? "grid-cols-1 max-w-2xl mx-auto"
                : "grid-cols-1 md:grid-cols-2"
            }`}
          >
            {videos.map((item) => (
              <ShowcaseVideo
                key={item.id}
                item={item}
                active={activeVideo === item.id}
                onPlay={() => setActiveVideo(item.id)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const ShowcaseImage = ({
  item,
  featured,
}: {
  item: MediaItem;
  featured: boolean;
}) => (
  <div
    className={`group relative overflow-hidden rounded-2xl bg-foreground/5 border border-foreground/10 hover:border-primary/30 transition-[border-color] duration-300 ${
      featured ? "md:row-span-2" : ""
    }`}
  >
    <div className={`${featured ? "aspect-[3/4]" : "aspect-video"} w-full`}>
      <img
        src={item.file_url}
        alt={item.alt_text || item.title}
        loading="lazy"
        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
      />
    </div>

    {/* Gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

    {/* Caption on hover */}
    {(item.caption || item.title) && (
      <div className="absolute bottom-0 inset-x-0 px-4 py-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-[transform,opacity] duration-300 pointer-events-none">
        <p className="text-white text-xs font-mono truncate">
          {item.caption || item.title}
        </p>
      </div>
    )}
  </div>
);

const ShowcaseVideo = ({
  item,
  active,
  onPlay,
}: {
  item: MediaItem;
  active: boolean;
  onPlay: () => void;
}) => (
  <div className="group relative overflow-hidden rounded-2xl bg-black border border-foreground/10 hover:border-primary/30 transition-[border-color] duration-300 aspect-video">
    {active ? (
      <video
        src={item.file_url}
        autoPlay
        controls
        className="w-full h-full object-contain"
      />
    ) : (
      <>
        {/* Poster frame if available */}
        <div className="w-full h-full flex items-center justify-center bg-foreground/5">
          <p className="font-mono text-xs text-foreground/25 uppercase tracking-widest">
            {item.title}
          </p>
        </div>

        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={onPlay}
            aria-label={`Play ${item.title}`}
            className="group/btn flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-full"
          >
            <span className="h-16 w-16 rounded-full bg-primary/90 flex items-center justify-center shadow-[0_0_40px_hsl(38_90%_58%_/_0.4)] group-hover/btn:bg-primary group-hover/btn:scale-110 transition-[background-color,transform] duration-200">
              <Play className="w-6 h-6 text-background fill-background ml-0.5" />
            </span>
            <span className="text-sm text-white/80 font-mono hidden sm:block">
              {item.caption || "Watch now"}
            </span>
          </button>
        </div>
      </>
    )}
  </div>
);
