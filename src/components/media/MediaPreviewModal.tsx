import { Copy, ExternalLink, Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { MediaItem } from "@/types/media";
import { formatBytes } from "@/hooks/useMediaLibrary";

interface Props {
  item: MediaItem | null;
  onClose: () => void;
  onEdit: (item: MediaItem) => void;
  onDelete: (item: MediaItem) => void;
}

export const MediaPreviewModal = ({ item, onClose, onEdit, onDelete }: Props) => {
  const copyUrl = async () => {
    if (!item) return;
    await navigator.clipboard.writeText(item.file_url);
    toast.success("URL copied to clipboard");
  };

  return (
    <Dialog open={!!item} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-5xl w-full p-0 overflow-hidden gap-0">
        <div className="grid md:grid-cols-[1fr_280px] min-h-[400px]">
          {/* Preview pane */}
          <div className="bg-black/50 flex items-center justify-center p-6 min-h-[300px]">
            {item?.file_type === "image" ? (
              <img
                src={item.file_url}
                alt={item.alt_text || item.title}
                className="max-w-full max-h-[65vh] object-contain rounded-lg"
              />
            ) : item?.file_type === "video" ? (
              <video
                src={item.file_url}
                controls
                className="max-w-full max-h-[65vh] rounded-lg"
              />
            ) : null}
          </div>

          {/* Info pane */}
          <div className="border-l border-border p-5 flex flex-col gap-4 overflow-y-auto max-h-[80vh]">
            {item && (
              <>
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-foreground/45 mb-1">
                    {item.file_type}
                  </p>
                  <h3 className="font-display text-xl leading-snug">{item.title}</h3>
                </div>

                {/* URL copy */}
                <div className="space-y-1">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-foreground/45">
                    File URL
                  </p>
                  <div className="flex items-center gap-2 bg-foreground/5 border border-border rounded-lg px-3 py-2">
                    <p className="text-[11px] text-foreground/55 truncate flex-1 font-mono leading-snug">
                      {item.file_url}
                    </p>
                    <button
                      onClick={copyUrl}
                      title="Copy URL"
                      className="shrink-0 text-primary hover:text-primary/70 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Metadata */}
                <div className="space-y-3 flex-1">
                  {item.alt_text && (
                    <MetaRow label="Alt text" value={item.alt_text} />
                  )}
                  {item.caption && (
                    <MetaRow label="Caption" value={item.caption} />
                  )}
                  <MetaRow
                    label="Mime type"
                    value={item.mime_type ?? "unknown"}
                  />
                  <MetaRow label="File size" value={formatBytes(item.size)} />
                  <MetaRow
                    label="Uploaded"
                    value={new Date(item.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 pt-3 border-t border-border mt-auto">
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full justify-start gap-2 bg-transparent border-foreground/20 hover:bg-foreground/5 text-xs"
                    onClick={() => window.open(item.file_url, "_blank")}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open original
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full justify-start gap-2 bg-transparent border-foreground/20 hover:bg-foreground/5 text-xs"
                    onClick={() => { onEdit(item); onClose(); }}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Edit metadata
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full justify-start gap-2 bg-transparent border-red-500/25 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 text-xs"
                    onClick={() => { onDelete(item); onClose(); }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const MetaRow = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-[10px] font-mono uppercase tracking-wider text-foreground/40 mb-0.5">
      {label}
    </p>
    <p className="text-sm text-foreground/75 leading-snug">{value}</p>
  </div>
);
