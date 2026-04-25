import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import { config } from "dotenv";

config({ path: new URL("../.env", import.meta.url).pathname });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const WEBSITE_CONTENT = [
  {
    source: "website",
    content: `Our platform is an end-to-end skin substitute management platform that combines benefits verification, supply chain management, and robust data analytics to help you deliver best-in-class wound care services and therapies.`,
  },
  {
    source: "website",
    content: `Benefits Verification: Faster benefit verification for the right patient and product. Automate BV validation, reduce manual touchpoints, and make clearer verification decisions with better payer visibility. Features include automated validation workflows, better visibility into payer policies, and fewer manual steps for your team.`,
  },
  {
    source: "website",
    content: `Order Management: Gain complete transparency and control. Manage orders, invoices, and inventory in one connected workflow so your staff can work faster with fewer handoffs. Features include efficient order management, transparent invoice management, and optimized inventory management.`,
  },
  {
    source: "website",
    content: `Invoice Management: Transparent invoice management. Track invoices more clearly and keep your team aligned from order to reconciliation.`,
  },
  {
    source: "website",
    content: `Inventory Management: Optimized skin substitute inventory management. Keep inventory aligned with patient care, order workflows, and supply planning in one place.`,
  },
  {
    source: "website",
    content: `Revenue Cycle Management: Simplify and optimize your skin substitute revenue cycle management. Reduce billing friction with clearer collections, claims tracking, reconciliation, and workflow support. Features include billing and collections visibility, claims tracking and reconciliation, and automated workflow support.`,
  },
  {
    source: "website",
    content: `The complexity of advanced wound care management can lead to unnecessary administrative burden, causing disruptions in operational workflow, inaccurate data, and inefficiencies in continuity of care. Our platform integrates with your existing EHR and EMR platforms to offer a streamlined, data-driven solution that addresses these pain points and helps enhance the delivery of care.`,
  },
  {
    source: "website",
    content: `Our platform supports the people responsible for operational performance and patient care. From executive visibility to clinician efficiency, it is a wound care platform your whole team can get behind. It supports executives, clinicians, and administrators responsible for operational performance and patient outcomes.`,
  },
  {
    source: "website",
    content: `Integration: Our platform integrates with your existing EMR and EHR environment so your team can work from a familiar source of truth. It connects with your current systems to avoid disruption and reduce the learning curve for clinical staff.`,
  },
  {
    source: "website",
    content: `The platform helps streamline workflows, elevate patient outcomes, and manage wound care services end-to-end. It simplifies wound care management with a modern, integrated workflow. You can schedule a demo or contact us to learn more about how it can transform your wound care management.`,
  },
];

function chunkText(text, size = 200, overlap = 30) {
  const words = text.split(/\s+/);
  const chunks = [];
  for (let i = 0; i < words.length; i += size - overlap) {
    const chunk = words.slice(i, i + size).join(" ");
    if (chunk.trim().length > 20) chunks.push(chunk);
  }
  return chunks;
}

async function seed() {
  console.log("🗑  Clearing existing website chunks…");
  await supabase.from("knowledge_chunks").delete().eq("source", "website");

  const allChunks = WEBSITE_CONTENT.flatMap((item) =>
    chunkText(item.content).map((c) => ({ text: c, source: item.source }))
  );

  console.log(`📝 Embedding ${allChunks.length} chunks…`);

  const embedRes = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: allChunks.map((c) => c.text),
  });

  const rows = allChunks.map((chunk, i) => ({
    content: chunk.text,
    embedding: embedRes.data[i].embedding,
    source: chunk.source,
  }));

  const { error } = await supabase.from("knowledge_chunks").insert(rows);
  if (error) {
    console.error("❌ Insert error:", error.message);
    process.exit(1);
  }

  console.log(`✅ Seeded ${rows.length} chunks into knowledge_chunks.`);
}

seed().catch((e) => { console.error(e); process.exit(1); });
