import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MediaItem } from "@/types/media";

interface Props {
  item: MediaItem | null;
  onClose: () => void;
  onSave: (
    id: string,
    patch: Partial<Pick<MediaItem, "title" | "alt_text" | "caption">>
  ) => Promise<void>;
}

export const MediaEditModal = ({ item, onClose, onSave }: Props) => {
  const [title, setTitle] = useState("");
  const [altText, setAltText] = useState("");
  const [caption, setCaption] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setAltText(item.alt_text ?? "");
      setCaption(item.caption ?? "");
      setError(null);
    }
  }, [item]);

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSave(item!.id, {
        title: title.trim(),
        alt_text: altText.trim(),
        caption: caption.trim(),
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={!!item} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Edit media</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <Label htmlFor="media-title">Title *</Label>
            <Input
              id="media-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Descriptive title"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="media-alt">
              Alt text
              <span className="ml-1.5 text-foreground/40 font-normal text-xs">(for screen readers)</span>
            </Label>
            <Input
              id="media-alt"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Describe the image content"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="media-caption">Caption</Label>
            <Textarea
              id="media-caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Optional caption displayed below the media"
              className="resize-none min-h-[80px]"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex justify-end gap-2 pt-1">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="rounded-full btn-gradient text-white border-0"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
