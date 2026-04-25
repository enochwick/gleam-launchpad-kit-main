# AI Handoff Document
**Project:** Gleam Launchpad Kit → heynok.com  
**Stack:** React + TypeScript + Vite, Tailwind CSS, shadcn/ui, Supabase, Resend, OpenAI, Vercel  
**Date:** April 2026

---

## Environment Variables

All of these must be set in both `.env` (local) and **Vercel → Project → Settings → Environment Variables**.

| Variable | Where Used | Notes |
|---|---|---|
| `RESEND_API_KEY` | `api/contact.ts` (server) | Rotated — get latest from Resend dashboard |
| `VITE_SUPABASE_URL` | Client + server | `https://lhtmagpryuxiibcpxywv.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Client (auth, DB reads) | Publishable key — safe to expose |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only (`api/*.ts`) | Secret — never expose client-side |
| `OPENAI_API_KEY` | `api/chat.ts`, `api/embed.ts` (server) | New key added — verify billing is active |
| `VITE_SITE_URL` | `src/pages/Login.tsx` | Set to `https://heynok.com` — used for auth email redirects |

---

## What Was Built

### 1. Landing Page Cleanup
- Removed "Your all-in-one advanced wound care" from `src/components/landing/Hero.tsx`
- Removed all "Healthview 360" branding from `Hero.tsx`, `Nav.tsx`, `Footer.tsx`, `CTA.tsx`

### 2. Contact Form Popup (`src/components/landing/ContactModal.tsx`)
- Triggered by "Contact Us" buttons in `Nav.tsx`, `Hero.tsx`, and `CTA.tsx`
- Fields: First name, Last name, Work email, Organization, Phone, Message
- On submit: POSTs to `/api/contact`
- Shows loading state, real success only after API confirms, error message on failure

### 3. Contact API (`api/contact.ts`)
- Validates all fields server-side
- Saves submission to Supabase `contact_submissions` table
- Sends email via Resend from `noreply@socialboothco.com` → `memories@socialboothco.com`
- `reply_to` set to submitter's email

### 4. Supabase Auth
- **Client:** `src/lib/supabase.ts`
- **Auth context:** `src/contexts/AuthContext.tsx` — provides `user`, `session`, `loading`, `signOut`
- **Protected route:** `src/components/auth/ProtectedRoute.tsx` — redirects unauthenticated users to `/login`
- **Auth callback:** `src/pages/AuthCallback.tsx` — handles email confirmation redirect, auto-logs in, redirects to `/dashboard`

### 5. Login / Register Page (`src/pages/Login.tsx`)
- Toggles between Sign In and Sign Up
- Sign Up fields: First name, Last name, Phone, Email, Password
- Extra fields stored in Supabase `user_metadata` (`first_name`, `last_name`, `phone`, `full_name`)
- After signup: shows a "Check your email" screen (not a toast — full card with resend option)
- `emailRedirectTo` uses `VITE_SITE_URL + /auth/callback` to ensure correct domain
- Handles "email not confirmed" error with a resend link
- Nav and Footer both have Login + Register/Create Account links

### 6. Dashboard (`src/pages/Dashboard.tsx`)
Four tabs:
- **Contact Submissions** — `src/components/dashboard/ContactSubmissions.tsx`: lists all form submissions, expandable rows
- **Documents** — `src/components/dashboard/FileUpload.tsx`: drag-and-drop upload to Supabase Storage, download via signed URL, delete
- **Onboarding** — `src/components/dashboard/OnboardingForm.tsx`: saves org name, role, team size, EHR system, use case, how heard — one row per user via upsert
- **AI Assistant** — `src/components/chat/ChatPanel.tsx`: inline RAG chatbot with suggested prompts

### 7. AI Chatbot (RAG)
- **Floating widget:** `src/components/chat/ChatWidget.tsx` — bottom-right of landing page, anyone can use
- **Dashboard panel:** `src/components/chat/ChatPanel.tsx` — inline in dashboard "AI Assistant" tab
- **Shared hook:** `src/hooks/useChat.ts`
- **Shared messages UI:** `src/components/chat/ChatMessages.tsx`
- **Chat API:** `api/chat.ts` — embeds user query with `text-embedding-3-small`, retrieves top 5 chunks from `knowledge_chunks` via `match_chunks()` RPC, sends to `gpt-4o-mini`
- **Embed API:** `api/embed.ts` — accepts text, chunks it, creates embeddings, stores in `knowledge_chunks`
- **Seed script:** `scripts/seed-kb.mjs` — run once with `node scripts/seed-kb.mjs` to embed website content. Already run successfully (10 chunks seeded).

### 8. Vercel / Deployment Fixes
- `vercel.json` — added SPA rewrite rule so React Router handles all routes (`/login`, `/dashboard`, `/auth/callback`)
- Removed `vercel` from `devDependencies` (was causing build failures)
- Removed invalid `functions` runtime config from `vercel.json`
- `.gitignore` — added `.env` and `.env.*` (was accidentally committed — keys were rotated)
- `.env.example` — safe placeholder file committed to repo

### 9. Supabase Configuration (Done Outside Code)
- **SMTP:** Connected to Resend (`smtp.resend.com:465`, user: `resend`, from: `noreply@socialboothco.com`)
- **Site URL:** `https://heynok.com`
- **Redirect URLs:** `https://heynok.com/auth/callback`
- **Email confirmation:** Enabled (users must confirm before signing in)

---

## Supabase Tables & SQL Run

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

-- Storage bucket: "documents" (private)
-- Policy:
create policy "Users manage own files" on storage.objects
  for all using (bucket_id = 'documents' and auth.uid()::text = (storage.foldername(name))[1]);
```

---

## What Is Working

- Contact form → email delivery to `memories@socialboothco.com` + saved to Supabase ✅
- User sign up with name/phone/email, email confirmation flow ✅
- Email confirmation link → `heynok.com/auth/callback` → auto login → dashboard ✅
- Protected dashboard (redirect to `/login` if not authenticated) ✅
- Contact submissions viewer in dashboard ✅
- File upload/download/delete (Supabase Storage) ✅
- Onboarding form with per-user persistence ✅
- Floating AI chat widget on landing page ✅
- Inline AI assistant tab in dashboard ✅
- RAG with website content (10 chunks seeded) ✅
- SPA routing on Vercel (`/auth/callback`, `/login`, `/dashboard` all work) ✅

---

## What Is Incomplete / Known Issues

| Issue | Details | Fix |
|---|---|---|
| **Documents not auto-embedded** | When a user uploads a file in the Documents tab, it goes to Supabase Storage but is NOT embedded into `knowledge_chunks`. The chatbot cannot answer questions about uploaded files yet. | Wire `FileUpload.tsx` to call `/api/embed` after a successful upload. For text files, read the content client-side. For PDFs, add `pdf-parse` to the API. |
| **No PDF text extraction** | `api/embed.ts` expects raw text. PDFs uploaded by users won't be parsed. | Add `pdf-parse` npm package to the embed API. Download file from Supabase Storage, extract text, embed. |
| **Auth email confirmation broken on localhost** | `emailRedirectTo` sends to `https://heynok.com/auth/callback`. Clicking the link locally won't work unless you add `http://localhost:8080/auth/callback` to Supabase redirect URLs. | Add `http://localhost:8080/auth/callback` to Supabase → Auth → URL Configuration → Redirect URLs. |
| **Secrets in git history** | Old Supabase/Resend keys were committed in an early commit. Keys have been rotated. | History was not rewritten — if this becomes a compliance concern, use `git filter-repo` to scrub the old commit. |
| **No streaming responses** | Chatbot waits for full response before displaying. | Use Vercel Edge functions with `ReadableStream` to stream tokens. |
| **No chat history persistence** | Each chat session starts fresh — messages are in component state only. | Create a `chat_sessions` / `chat_messages` table in Supabase and save/load per user. |

---

## What the Next Agent Should Do

### Priority 1 — Auto-embed uploaded documents
In `src/components/dashboard/FileUpload.tsx`, after a successful Supabase Storage upload:
1. For `.txt` / `.md` files: read with `FileReader`, POST text to `/api/embed` with `document_id`
2. For `.pdf` files: send the storage path to a new `api/extract-and-embed.ts` that uses `pdf-parse` to extract text then embeds it
3. Also delete chunks from `knowledge_chunks` when a document is deleted (already cascades via FK if `document_id` is set)

### Priority 2 — Persist chat history
Create tables:
```sql
create table chat_sessions (id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id), created_at timestamptz default now());
create table chat_messages (id uuid primary key default gen_random_uuid(), session_id uuid references chat_sessions(id) on delete cascade, role text, content text, created_at timestamptz default now());
```
Update `useChat.ts` to load/save messages from Supabase for authenticated users.

### Priority 3 — Streaming chat responses
Convert `api/chat.ts` to a Vercel Edge function using `openai.chat.completions.create({ stream: true })` and return a `ReadableStream`. Update `useChat.ts` to read the stream and append tokens progressively.

### Priority 4 — Custom Supabase email templates
Go to Supabase → Auth → Email Templates and brand the confirmation email with the site name and logo instead of the default Supabase template.

---

## Key File Map

```
src/
  lib/supabase.ts                          Supabase client
  contexts/AuthContext.tsx                 Auth state (user, session, signOut)
  hooks/useChat.ts                         Shared chat logic
  components/
    auth/ProtectedRoute.tsx                Auth guard
    chat/
      ChatWidget.tsx                       Floating widget (landing page)
      ChatPanel.tsx                        Inline panel (dashboard)
      ChatMessages.tsx                     Shared message bubbles
    dashboard/
      ContactSubmissions.tsx               Submissions viewer
      FileUpload.tsx                       File upload/download/delete
      OnboardingForm.tsx                   Onboarding form
    landing/
      Nav.tsx                              Has Login + Register + Contact buttons
      Hero.tsx                             Has Contact Us button
      CTA.tsx                              Has Contact Us button
      ContactModal.tsx                     Contact form popup
      Footer.tsx                           Has Login + Create Account links
  pages/
    Index.tsx                              Landing page (includes ChatWidget)
    Login.tsx                              Sign in / Sign up / Check email states
    Dashboard.tsx                          Protected dashboard with 4 tabs
    AuthCallback.tsx                       Handles email confirmation redirect
api/
  contact.ts                              Contact form → Resend + Supabase
  chat.ts                                 RAG chat (OpenAI gpt-4o-mini)
  embed.ts                                Text → embeddings → knowledge_chunks
scripts/
  seed-kb.mjs                             One-time website content seeder (already run)
vercel.json                               SPA rewrites + build config
.env.example                             Safe env var template
```
