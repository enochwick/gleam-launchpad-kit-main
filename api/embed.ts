import type { VercelRequest, VercelResponse } from "@vercel/node";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function chunkText(text: string, size = 500, overlap = 50): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  for (let i = 0; i < words.length; i += size - overlap) {
    chunks.push(words.slice(i, i + size).join(" "));
  }
  return chunks.filter((c) => c.trim().length > 20);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { text, source = "document", document_id } = req.body ?? {};
    if (!text?.trim()) return res.status(400).json({ error: "text required" });

    const chunks = chunkText(text);
    if (chunks.length === 0) return res.status(400).json({ error: "not enough text to embed" });

    const embeddings = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: chunks,
    });

    const rows = chunks.map((content, i) => ({
      content,
      embedding: embeddings.data[i].embedding,
      source,
      document_id: document_id ?? null,
    }));

    if (document_id) {
      const { error: deleteError } = await supabase.from("knowledge_chunks").delete().eq("document_id", document_id);
      if (deleteError) return res.status(500).json({ error: deleteError.message });
    }

    const { error } = await supabase.from("knowledge_chunks").insert(rows);
    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json({ success: true, chunks: rows.length });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Embedding failed";
    return res.status(500).json({ error: message });
  }
}
