import type { VercelRequest, VercelResponse } from "@vercel/node";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { messages } = req.body ?? {};
  if (!messages?.length) return res.status(400).json({ error: "messages required" });

  const query = messages[messages.length - 1]?.content as string;

  // Embed the user query
  const embeddingRes = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: query,
  });
  const queryEmbedding = embeddingRes.data[0].embedding;

  // Retrieve relevant chunks from Supabase
  const { data: chunks } = await supabase.rpc("match_chunks", {
    query_embedding: queryEmbedding,
    match_count: 5,
    match_threshold: 0.5,
  });

  const context = chunks?.length
    ? chunks.map((c: { content: string }) => c.content).join("\n\n")
    : "No specific knowledge base content found.";

  const systemPrompt = `You are a helpful assistant. Use the following knowledge base context to answer questions accurately. If the answer isn't in the context, answer based on your general knowledge but be transparent about it.

KNOWLEDGE BASE CONTEXT:
${context}

Be concise, friendly, and helpful.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      ...messages,
    ],
    max_tokens: 500,
    temperature: 0.7,
  });

  const reply = completion.choices[0].message.content;
  return res.status(200).json({ reply });
}
