import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

interface DocRow {
  id: string;
  name: string;
  storage_path: string;
  size: number;
  mime_type: string;
  created_at: string;
}

const formatBytes = (b: number) =>
  b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(1)} MB`;

const EMBEDDABLE_EXTENSIONS = new Set(["txt", "md", "markdown", "csv", "json"]);

const canEmbedClientSide = (file: File) => {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  return file.type.startsWith("text/") || EMBEDDABLE_EXTENSIONS.has(extension);
};

export const FileUpload = () => {
  const { user } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [docs, setDocs] = useState<DocRow[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [embeddingDocs, setEmbeddingDocs] = useState<Record<string, boolean>>({});

  const fetchDocs = useCallback(async () => {
    if (!user) return;

    const { data } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (data) setDocs(data);
  }, [user]);

  useEffect(() => { fetchDocs(); }, [fetchDocs]);

  const embedFile = async (file: File, documentId: string) => {
    if (!canEmbedClientSide(file)) {
      toast.info("File uploaded", {
        description: `${file.name} is saved. Text, Markdown, CSV, and JSON files are indexed for AI answers.`,
      });
      return;
    }

    setEmbeddingDocs((prev) => ({ ...prev, [documentId]: true }));

    try {
      const text = await file.text();
      const response = await fetch("/api/embed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          source: file.name,
          document_id: documentId,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.error || "Document uploaded, but indexing failed.");
      }

      toast.success("Document indexed", {
        description: `${file.name} is ready for AI Assistant questions.`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Document uploaded, but indexing failed.");
    } finally {
      setEmbeddingDocs((prev) => {
        const next = { ...prev };
        delete next[documentId];
        return next;
      });
    }
  };

  const uploadFile = async (file: File) => {
    setError(null);
    setUploading(true);
    const path = `${user!.id}/${Date.now()}-${file.name}`;

    const { error: storageErr } = await supabase.storage
      .from("documents")
      .upload(path, file, { upsert: false });

    if (storageErr) {
      setError(storageErr.message);
      setUploading(false);
      return;
    }

    const { data: doc, error: dbErr } = await supabase.from("documents").insert({
      user_id: user!.id,
      name: file.name,
      storage_path: path,
      size: file.size,
      mime_type: file.type,
    }).select("*").single<DocRow>();

    if (dbErr || !doc) {
      await supabase.storage.from("documents").remove([path]);
      setError(dbErr?.message || "File uploaded, but document metadata could not be saved.");
      setUploading(false);
      return;
    }

    await fetchDocs();
    setUploading(false);
    await embedFile(file, doc.id);
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    Array.from(files).forEach(uploadFile);
  };

  const handleDelete = async (doc: DocRow) => {
    await supabase.from("knowledge_chunks").delete().eq("document_id", doc.id);
    await supabase.storage.from("documents").remove([doc.storage_path]);
    await supabase.from("documents").delete().eq("id", doc.id);
    setDocs((prev) => prev.filter((d) => d.id !== doc.id));
  };

  const handleDownload = async (doc: DocRow) => {
    const { data } = await supabase.storage
      .from("documents")
      .createSignedUrl(doc.storage_path, 60);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Drop zone */}
      <div
        className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer ${
          dragging ? "border-primary bg-primary/5" : "border-foreground/20 hover:border-primary/50"
        }`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="text-4xl mb-3">↑</div>
        <p className="font-medium">{uploading ? "Uploading…" : "Drop files here or click to browse"}</p>
        <p className="text-sm text-foreground/50 mt-1">Any file type accepted</p>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* File list */}
      {docs.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-foreground/50 font-medium uppercase tracking-wide">Uploaded files</p>
          {docs.map((doc) => (
            <div key={doc.id} className="card-glow rounded-xl px-4 py-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium text-sm truncate">{doc.name}</p>
                <p className="text-xs text-foreground/50">
                  {formatBytes(doc.size)} · {new Date(doc.created_at).toLocaleDateString()}
                  {embeddingDocs[doc.id] ? " · Indexing…" : ""}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button variant="ghost" size="sm" className="text-xs h-8 px-3" onClick={() => handleDownload(doc)}>
                  Download
                </Button>
                <Button variant="ghost" size="sm" className="text-xs h-8 px-3 text-red-500 hover:text-red-400" onClick={() => handleDelete(doc)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
