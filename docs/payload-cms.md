# Moves CMS (Payload) — setup & editing guide

The landing page is fully content-managed by **Payload CMS 3**, embedded in the
Next.js app. Every section, image and video is editable from an admin dashboard.

- **Public site:** `http://localhost:3000`
- **Admin dashboard:** `http://localhost:3000/admin`
- **Content model:** one **Global per section** (14 of them) under the sidebar
  group **“Landing Page”**, plus a **Media Library** for images/videos.

The site is resilient: if the CMS database isn’t configured yet, every section
falls back to its built-in default content, so the page always renders.

## Runs locally with zero setup
The CMS uses a **local SQLite file** (`apps/web/moves-cms-dev.db`, git-ignored)
automatically whenever `DATABASE_URL` is not set, and uploads are stored in
`apps/web/public/media`. So you can run the whole thing today:

```bash
pnpm --filter @moves/web seed   # populates all 14 sections + uploads images
pnpm --filter @moves/web dev
```

Open **http://localhost:3000/admin**, create your first user, and every section
appears under **Landing Page** in the sidebar. The moment you set `DATABASE_URL`
(below), it switches to **Supabase Postgres** instead — no code change.

---

## Production setup (Supabase)

### 1. Create the Supabase project
[supabase.com/dashboard](https://supabase.com/dashboard) → **New project**. Note the
database password you set.

### 2. Environment variables
```bash
cd apps/web
cp .env.example .env
```
Fill in `.env`:

| Var | Where to get it |
|---|---|
| `PAYLOAD_SECRET` | Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `DATABASE_URL` | Supabase → **Project Settings → Database → Connection string → URI**. Use the **Session pooler / direct connection (port 5432)** and append `?sslmode=require`. Avoid the transaction pooler (6543) — it breaks Payload’s prepared statements. |
| `S3_BUCKET` | Supabase → **Storage** → create a **public** bucket, e.g. `moves-media` |
| `S3_ENDPOINT` | Supabase → Storage → **S3 Connection** → endpoint (`https://<ref>.supabase.co/storage/v1/s3`) |
| `S3_REGION` | From the same S3 Connection panel (e.g. `eu-west-2`) |
| `S3_ACCESS_KEY_ID` / `S3_SECRET_ACCESS_KEY` | Supabase → Storage → **Access Keys** → New key |

> Leave the `S3_*` vars blank to store uploads on local disk instead — handy for
> a first run before Storage is set up.

### 3. Create the database schema
In development the Postgres schema **auto-syncs** on first boot. For production,
generate and run migrations:
```bash
pnpm --filter @moves/web migrate:create
pnpm --filter @moves/web migrate
```

### 4. Generate TypeScript types (optional but recommended)
```bash
pnpm --filter @moves/web generate:types
```

### 5. Seed the current content
Populates all 14 sections with the live copy and uploads `/public/images` into
the Media library:
```bash
pnpm --filter @moves/web seed
```

### 6. Run it
```bash
pnpm --filter @moves/web dev
```
Open `/admin`, create your first admin user when prompted, and start editing.

---

## Editing the site
- Each section lives under **Landing Page** in the sidebar, numbered in page
  order (`1 · Header & Hero` → `14 · Footer`).
- Text fields are grouped and labelled; two-tone headings have a **Coral part**
  and a **Navy part**.
- Images/videos: pick from the **Media Library** (or upload inline). Add **alt
  text** for accessibility/SEO.
- Repeatable content (nav links, steps, cases, plans, reviews, dentists, FAQs…)
  are **arrays** — add/remove/reorder rows.
- Saving a global updates the live site on the next page load.

## Notes
- The frontend page is rendered dynamically so edits appear immediately. For
  production performance you can switch it to ISR (`export const revalidate`).
- Media stored locally (no `S3_*`) lands in `apps/web/public/media` and is
  git-ignored; switch to Supabase Storage before deploying.
