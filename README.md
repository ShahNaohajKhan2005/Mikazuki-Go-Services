# Mikazuki GO Services

Black-and-purple Pokémon GO services storefront with an account catalogue, search, filters, detail dialogs, and administrator listing management. Hosted with Vercel Functions; saved accounts and attachments use Vercel Blob.

## Deploy

1. In Vercel, import `ShahNaohajKhan2005/Mikazuki-Go-Services` into your team.
2. Name the project `mikazuki-go-services`. Framework preset: Other. Output directory: `public`. Leave build command empty. Node.js 22 or newer.
3. Under Settings → Environment Variables, add `ADMIN_PASSWORD` (a strong password you choose) and `SESSION_SECRET` (a random string of at least 32 characters) to Production and Preview. Do not share or commit them.
4. Create a **public** Vercel Blob store from the Storage tab and connect it to this project. Vercel adds `BLOB_READ_WRITE_TOKEN` automatically. Account screenshots, PDFs, and listing information are public marketing content; never upload passwords or private account credentials.
5. Deploy or redeploy after configuring environment variables and storage. Set the production domain to `mikazuki-go-services.vercel.app` if available.

The services page works before storage is connected. Account writes stay disabled until administrator credentials and Blob storage are configured.

## Manage accounts

Open `/accounts.html`, scroll to **Seller access**, and enter your administrator password. Add a title, price, category, specifications, and optional statistics. Attach up to eight JPEG, PNG, WebP, or PDF files, **3 MB per file**. Files upload individually to stay within Vercel Function request limits. Save the listing; the cards update immediately. Edit and Delete are shown after sign-in. Sign out when finished.

Administrator sessions use signed HttpOnly cookies, expire after eight hours, and reject cross-origin writes. Changing the session secret invalidates existing sessions. The sign-in endpoint has no persistent rate limiter; use Vercel Firewall rate limiting before exposing administrator access widely.

## Migration scope

This repository preserves the storefront and functionality. Existing records from the original hosted site are not automatically copied into the new Blob store. Keep the original website available until any existing listings and attachments have been transferred and verified. No old data is deleted by this application.

## Development

`npm ci` then `npm test`. For Vercel runtime development, use `npx vercel dev` with a local untracked environment file. Never commit `.env`, tokens, private passwords, or storage credentials.

No payment checkout or order submission is connected. Inquiries are copyable messages, and layout-preview cards are clearly labeled examples, not accounts for sale.

## Community account submissions

Visitors can use **Sell account** to submit their seller display name, public HTTPS contact/shop link, account specifications, and selling price in **BDT (৳)**. These submissions are pending until the administrator approves or rejects them. The administrator's **Pending seller submissions** queue provides review actions. Approved community accounts display their seller contact link. Public submissions are text-only; the administrator can add images/PDFs after review. Pending content is stored in the public Blob store and must not contain private information. Configure Vercel Firewall rate limits on `/api/submissions` to control spam.
