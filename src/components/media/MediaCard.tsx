import { Eye, Copy, Pencil, Trash2, Film } from "lucide-react";
import { MediaItem } from "@/types/media";
import { formatBytes } from "@/hooks/useMediaLibrary";

interface Props {
  item: MediaItem;
  onPreview: (item: MediaItem) => void;
  onEdit: (item: MediaItem) => void;
  onDelete: (item: MediaItem) => void;
  onCopy: (url: string) => void;
}

export const MediaCard = ({ item, onPreview, onEdit, onDelete, onCopy }: Props) => (
  <div className="group relative card-glow rounded-xl overflow-hidden cursor-pointer">
    {/* Thumbnail */}
    <div
      className="aspect-[4/3] bg-foreground/5 relative overflow-hidden"
      onClick={() => onPreview(item)}
    >
      {item.file_type === "image" ? (
        <img
          src={item.file_url}
          alt={item.alt_text || item.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-foreground/5">
          <Film className="w-8 h-8 text-foreground/25" />
          <span className="text-[10px] font-mono text-foreground/35 uppercase tracking-wider">
            Video
          </span>
        </div>
      )}

      {/* Hover action overlay */}
      <div className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
        <ActionBtn icon={Eye} label="Preview" onClick={() => onPreview(item)} />
        <ActionBtn icon={Copy} label="Copy URL" onClick={() => onCopy(item.file_url)} />
        <ActionBtn icon={Pencil} label="Edit" onClick={() => onEdit(item)} />
        <ActionBtn icon={Trash2} label="Delete" onClick={() => onDelete(item)} danger />
      </div>
    </div>

    {/* Footer */}
    <div className="px-3 py-2.5">
      <p className="text-xs font-medium truncate leading-snug">{item.title}</p>
      <div className="flex items-center justify-between mt-1">
        <span className="text-[10px] text-foreground/45 font-mono">
          {formatBytes(item.size)}
        </span>
        <span
          className={`text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
            item.file_type === "image"
              ? "bg-primary/15 text-primary"
              : "bg-foreground/10 text-foreground/50"
          }`}
        >
          {item.file_type}
        </span>
      </div>
    </div>
  </div>
);

const ActionBtn = ({
  icon: Icon,
  label,
  onClick,
  danger = false,
}: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) => (
  <button
    title={label}
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    className={`h-9 w-9 rounded-full flex items-center justify-center transition-colors ${
      danger
        ? "bg-red-500/20 hover:bg-red-500/40 text-red-300"
        : "bg-white/15 hover:bg-white/30 text-white"
    }`}
  >
    <Icon className="w-4 h-4" />
  </button>
);
