# AI Handoff Document
**Project:** Gleam Launchpad Kit → heynok.com  
**Stack:** React + TypeScript + Vite, Tailwind CSS, shadcn/ui, Supabase, Resend, OpenAI, Vercel  
**Date:** April 2026

---

## Environment Variables

All must be set in `.env` (local) AND **Vercel → Project → Settings → Environment Variables**.

| Variable | Used In | Notes |
|---|---|---|
| `RESEND_API_KEY` | `api/contact.ts` (server) | Rotated — get latest from Resend dashboard |
| `VITE_SUPABASE_URL` | Client + server | `https://lhtmagpryuxiibcpxywv.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Client (auth, DB reads) | Publishable key — safe to expose |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only (`api/*.ts`) | Secret — never expose client-side |
| `OPENAI_API_KEY` | `api/chat.ts`, `api/embed.ts` | Verify billing is active at platform.openai.com |
| `VITE_SITE_URL` | `src/pages/Login.tsx` | `https://heynok.com` — controls auth email redirect |

---

## What Was Built

### 1. Landing Page Cleanup
- Removed "Your all-in-one advanced wound care" from `src/components/landing/Hero.tsx`
- Removed all "Healthview 360" branding from `Hero.tsx`, `Nav.tsx`, `Footer.tsx`, `CTA.tsx`

### 2. Contact Form Popup (`src/components/landing/ContactModal.tsx`)
- Triggered by "Contact Us" buttons in `Nav.tsx`, `Hero.tsx`, and `CTA.tsx`
- Fields: First name, Last name, Work email, Organization, Phone, Message
- POSTs to `/api/contact` — real success only after API confirms, error on failure

### 3. Contact API (`api/contact.ts`)
- Validates all fields server-side
- Saves submission to Supabase `contact_submissions` table
- Sends email via Resend: `noreply@socialboothco.com` → `memories@socialboothco.com`
- `reply_to` set to submitter's email

### 4. Supabase Auth
- **Client:** `src/lib/supabase.ts`
- **Auth context:** `src/contexts/AuthContext.tsx` — provides `user`, `session`, `loading`, `signOut`
- **Protected route:** `src/components/auth/ProtectedRoute.tsx`
- **Auth callback:** `src/pages/AuthCallback.tsx` — handles email confirmation, auto-logs in, redirects to `/dashboard`

### 5. Login / Register Page (`src/pages/Login.tsx`)
- Toggles between Sign In and Sign Up modes
- Sign Up fields: First name, Last name, Phone, Email, Password (stored in `user_metadata`)
- After signup → "Check your email" card with resend option
- `emailRedirectTo` uses `VITE_SITE_URL/auth/callback`
- Handles "email not confirmed" error with a resend link
- Nav and Footer both have Login + Register links

### 6. Dashboard (`src/pages/Dashboard.tsx`)
Four tabs:
- **Contact Submissions** (`src/components/dashboard/ContactSubmissions.tsx`) — lists all submissions, expandable rows
- **Documents** (`src/components/dashboard/FileUpload.tsx`) — drag-and-drop, Supabase Storage, download/delete, auto-embedding ✅
- **Onboarding** (`src/components/dashboard/OnboardingForm.tsx`) — saves org, role, team size, EHR, use case, one row per user
- **AI Assistant** (`src/components/chat/ChatPanel.tsx`) — inline RAG chatbot with suggested prompts

### 7. AI Chatbot (RAG)
- **Floating widget:** `src/components/chat/ChatWidget.tsx` — bottom-right corner, anyone can use
- **Dashboard panel:** `src/components/chat/ChatPanel.tsx` — inline in "AI Assistant" tab
- **Shared hook:** `src/hooks/useChat.ts`
- **Shared message UI:** `src/components/chat/ChatMessages.tsx`
- **Chat API:** `api/chat.ts` — embeds query with `text-embedding-3-small`, retrieves top 5 chunks via `match_chunks()` RPC, responds with `gpt-4o-mini`
- **Embed API:** `api/embed.ts` — accepts text + optional `document_id`, chunks it, embeds, stores in `knowledge_chunks`. Re-embeds on re-upload (deletes old chunks first).
- **Seed script:** `scripts/seed-kb.mjs` — run once with `node scripts/seed-kb.mjs`. Already executed — 10 website content chunks seeded.

### 8. Auto-Embedding Uploaded Documents ✅
`src/components/dashboard/FileUpload.tsx` now:
- After upload, reads `.txt`, `.md`, `.markdown`, `.csv`, `.json` files client-side
- POSTs text to `/api/embed` with the `document_id`
- Shows "Indexing…" status on the file row while embedding
- Shows success toast when indexed, info toast for non-embeddable types (PDFs, images)
- On delete: removes chunks from `knowledge_chunks` before deleting the file

### 9. Vercel / Deployment Fixes
- `vercel.json` — SPA rewrite rule so React Router handles all routes
- Removed `vercel` from devDependencies (was causing build failures)
- Removed invalid `functions` runtime config
- `.gitignore` — added `.env` and `.env.*`
- `.env.example` — safe placeholder committed to repo

### 10. Supabase Configuration (Done in Dashboard)
- **SMTP:** Resend — `smtp.resend.com:465`, user: `resend`, from: `noreply@socialboothco.com`
- **Site URL:** `https://heynok.com`
- **Redirect URLs:** `https://heynok.com/auth/callback`
- **Email confirmation:** Enabled

---

## Supabase Tables & SQL

```sql
-- Contact form submissions
create table contact_submissions (
  id uuid default gen_random_uuid() primary key,
  first_name text not null, last_name text not null, email text not null,
  organization text, phone text, message text not null,
  created_at timestamptz default now()
);

-- File metadata
create table documents (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null, storage_path text not null,
  size integer, mime_type text, created_at timestamptz default now()
);

-- Onboarding (one row per user)
create table onboarding (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  company_name text, role text, team_size text,
  ehr_system text, use_case text, how_heard text,
  created_at timestamptz default now()
);

-- RAG knowledge base
create extension if not exists vector;
create table knowledge_chunks (
  id uuid default gen_random_uuid() primary key,
  content text not null, embedding vector(1536),
  source text default 'document',
  document_id uuid references documents(id) on delete cascade,
  created_at timestamptz default now()
);
create index on knowledge_chunks using ivfflat (embedding vector_cosine_ops) with (lists = 100);

create or replace function match_chunks(
  query_embedding vector(1536), match_count int default 5, match_threshold float default 0.5
)
returns table (id uuid, content text, source text, similarity float)
language sql stable as $$
  select id, content, source, 1 - (embedding <=> query_embedding) as similarity
  from knowledge_chunks
  where 1 - (embedding <=> query_embedding) > match_threshold
  order by embedding <=> query_embedding limit match_count;
$$;

-- Storage bucket: "documents" (private) — create in Supabase UI
-- Storage policy (run in SQL Editor):
create policy "Users manage own files" on storage.objects
  for all using (bucket_id = 'documents' and auth.uid()::text = (storage.foldername(name))[1]);

-- RLS policies
alter table contact_submissions enable row level security;
create policy "Auth users can read submissions" on contact_submissions
  for select using (auth.role() = 'authenticated');
alter table documents enable row level security;
create policy "Users manage own documents" on documents for all using (auth.uid() = user_id);
alter table onboarding enable row level security;
create policy "Users manage own onboarding" on onboarding for all using (auth.uid() = user_id);
```

---

## What Is Working ✅

- Contact form → email to `memories@socialboothco.com` + saved to Supabase
- User sign up with name/phone/email + email confirmation flow
- Email confirmation → `heynok.com/auth/callback` → auto login → dashboard
- Protected dashboard (redirect to `/login` if not authenticated)
- Contact submissions viewer
- File upload/download/delete (Supabase Storage)
- **Auto-embedding** of `.txt`, `.md`, `.csv`, `.json` files on upload
- Onboarding form with per-user persistence
- Floating AI chat widget on landing page (anyone)
- Inline AI assistant tab in dashboard (logged-in users)
- RAG with website content (10 chunks seeded) + user-uploaded text documents
- SPA routing on Vercel

---

## What Is Incomplete / Known Issues

| Issue | Details | Fix |
|---|---|---|
| **No PDF text extraction** | PDFs upload fine but are not embedded — chatbot can't read them | Add `pdf-parse` to `api/embed.ts`. Download from Supabase Storage, extract text, embed. Or use a serverless-compatible parser like `pdfjs-dist`. |
| **No chat history persistence** | Messages live in component state only — lost on refresh/re-login | Create `chat_sessions` + `chat_messages` tables. Update `useChat.ts` to load/save per user. |
| **No streaming responses** | Chatbot waits for full response before displaying | Convert `api/chat.ts` to Vercel Edge function with `ReadableStream`. Update `useChat.ts` to consume stream. |
| **Auth email broken on localhost** | `emailRedirectTo` always points to `https://heynok.com/auth/callback` | Add `http://localhost:8080/auth/callback` to Supabase → Auth → URL Configuration → Redirect URLs for local dev. |
| **Secrets in git history** | Old keys committed in early commit — already rotated | Use `git filter-repo` to scrub if compliance requires it. |

---

## What the Next Agent Should Do

### Priority 1 — PDF text extraction
In `api/embed.ts` or a new `api/extract-and-embed.ts`:
1. Accept a `storage_path` instead of raw text
2. Download the file from Supabase Storage using the service role key
3. Parse PDF with `pdfjs-dist` (works in Node/Edge without native deps)
4. Pass extracted text through existing chunking + embedding pipeline
5. Update `FileUpload.tsx` to call this endpoint for `.pdf` files instead of skipping them

### Priority 2 — Persist chat history
```sql
create table chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text,
  created_at timestamptz default now()
);
create table chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references chat_sessions(id) on delete cascade,
  role text check (role in ('user','assistant')),
  content text,
  created_at timestamptz default now()
);
```
Update `useChat.ts` to load history on mount and save each message pair after response.

### Priority 3 — Streaming chat responses
Convert `api/chat.ts` to a Vercel Edge function:
```ts
export const config = { runtime: 'edge' };
```
Use `openai.chat.completions.create({ stream: true })` and pipe through a `TransformStream`. Update `useChat.ts` to read the stream with `response.body.getReader()` and append tokens as they arrive.

### Priority 4 — Custom Supabase email templates
Supabase → Auth → Email Templates → Confirm signup. Brand the email with the site name, logo, and a clean CTA button instead of the default plain link.

---

## Key File Map

```
src/
  lib/supabase.ts                          Supabase client (publishable key)
  contexts/AuthContext.tsx                 Auth state — user, session, signOut
  hooks/useChat.ts                         Chat state + fetch logic
  components/
    auth/ProtectedRoute.tsx                Redirects unauthenticated users to /login
    chat/
      ChatWidget.tsx                       Floating widget (landing page, bottom-right)
      ChatPanel.tsx                        Inline panel (dashboard AI Assistant tab)
      ChatMessages.tsx                     Shared message bubble UI
    dashboard/
      ContactSubmissions.tsx               Lists contact form submissions
      FileUpload.tsx                       Upload/delete/embed docs (auto-embeds txt/md/csv/json)
      OnboardingForm.tsx                   Per-user onboarding data
    landing/
      Nav.tsx                              Login + Register + Contact buttons
      Hero.tsx                             Contact Us button
      CTA.tsx                              Contact Us button
      ContactModal.tsx                     Contact form popup
      Footer.tsx                           Login + Create Account links
  pages/
    Index.tsx                              Landing page + ChatWidget
    Login.tsx                              Sign in / Sign up / Check email
    Dashboard.tsx                          Protected — 4 tabs
    AuthCallback.tsx                       Handles Supabase email confirmation redirect
api/
  contact.ts                              Contact form → Resend email + Supabase insert
  chat.ts                                 RAG chat — embed query, retrieve chunks, gpt-4o-mini
  embed.ts                                Text → embeddings → knowledge_chunks (with re-embed support)
scripts/
  seed-kb.mjs                             One-time website content seeder (already run ✅)
vercel.json                               SPA rewrites + Vite build config
.env.example                             Safe placeholder for all required env vars
AI_HANDOFF.md                            This file
```
