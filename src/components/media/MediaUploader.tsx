import { useCallback, useRef, useState } from "react";
import { Upload, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { validateFile, ACCEPTED_MIME } from "@/hooks/useMediaLibrary";

interface UploadJob {
  id: string;
  name: string;
  status: "pending" | "uploading" | "done" | "error";
  error?: string;
}

interface Props {
  onUpload: (file: File) => Promise<void>;
}

export const MediaUploader = ({ onUpload }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [jobs, setJobs] = useState<UploadJob[]>([]);

  const processFiles = useCallback(
    (files: File[]) => {
      const newJobs: UploadJob[] = files.map((file) => ({
        id: `${Date.now()}-${Math.random()}`,
        name: file.name,
        status: "pending",
      }));

      setJobs((prev) => [...prev, ...newJobs]);

      // Run sequentially so the grid updates one-by-one
      (async () => {
        for (let i = 0; i < files.length; i++) {
          const job = newJobs[i];
          const file = files[i];

          const validationError = validateFile(file);
          if (validationError) {
            setJobs((prev) =>
              prev.map((j) =>
                j.id === job.id ? { ...j, status: "error", error: validationError } : j
              )
            );
            continue;
          }

          setJobs((prev) =>
            prev.map((j) => (j.id === job.id ? { ...j, status: "uploading" } : j))
          );

          try {
            await onUpload(file);
            setJobs((prev) =>
              prev.map((j) => (j.id === job.id ? { ...j, status: "done" } : j))
            );
          } catch (err) {
            setJobs((prev) =>
              prev.map((j) =>
                j.id === job.id
                  ? {
                      ...j,
                      status: "error",
                      error: err instanceof Error ? err.message : "Upload failed",
                    }
                  : j
              )
            );
          }
        }
      })();
    },
    [onUpload]
  );

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    processFiles(Array.from(e.dataTransfer.files));
  };

  const clearCompleted = () =>
    setJobs((prev) => prev.filter((j) => j.status !== "done"));

  return (
    <div className="space-y-3">
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          dragging
            ? "border-primary bg-primary/5"
            : "border-foreground/20 hover:border-primary/50"
        }`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED_MIME}
          className="hidden"
          onChange={(e) => {
            if (e.target.files) processFiles(Array.from(e.target.files));
            e.target.value = "";
          }}
        />
        <Upload className="w-8 h-8 mx-auto mb-3 text-foreground/40" />
        <p className="font-medium text-sm">Drop files here or click to browse</p>
        <p className="text-xs text-foreground/45 mt-1.5 leading-relaxed">
          Images: JPG, PNG, GIF, WebP, SVG — max 10 MB
          <span className="mx-2 text-foreground/25">·</span>
          Videos: MP4, MOV, WebM — max 100 MB
        </p>
      </div>

      {jobs.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-mono uppercase tracking-wider text-foreground/45">
              Upload queue
            </p>
            {jobs.some((j) => j.status === "done") && (
              <button
                onClick={clearCompleted}
                className="text-xs text-foreground/40 hover:text-foreground transition-colors"
              >
                Clear done
              </button>
            )}
          </div>

          {jobs.map((job) => (
            <div
              key={job.id}
              className="card-glow rounded-lg px-4 py-2.5 flex items-center gap-3"
            >
              <p className="flex-1 text-sm truncate min-w-0">{job.name}</p>
              <div className="shrink-0 flex items-center gap-2">
                {job.status === "pending" && (
                  <div className="w-4 h-4 rounded-full border-2 border-foreground/20" />
                )}
                {job.status === "uploading" && (
                  <Loader2 className="w-4 h-4 text-primary animate-spin" />
                )}
                {job.status === "done" && (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
                {job.status === "error" && (
                  <>
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <span className="text-xs text-red-400 max-w-[220px] truncate">
                      {job.error}
                    </span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
