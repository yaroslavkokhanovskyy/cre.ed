# CRE-Ed.com: going live (about 45 minutes)

This folder is the whole website. It has no build step and no monthly platform fee.
Out of the box it runs in **demo mode** (open `index.html` through any web server): logins, progress and "payments" are
stored in your own browser only, so you can click through everything. Follow the steps below to switch on the real thing.

What runs where:
- **Website pages** → any static host (Cloudflare Pages, Netlify or Vercel; all have free plans).
- **Logins, progress, worksheets, coach submissions, private videos** → Supabase (free plan is enough to start).
- **Payments** → Stripe. Two small Supabase "functions" (in `supabase/functions`) connect Stripe to access.

> Not yet tested against live Supabase/Stripe accounts (I can't create those for you). The demo mode was tested end to end;
> the live parts follow Supabase and Stripe's standard patterns. Do steps 1–7 on a test Stripe key first and buy Offer 1 with
> card 4242 4242 4242 4242 before going live.

## 1. Supabase project
1. Create a project at supabase.com (region: Canada Central if offered).
2. **SQL Editor → New query**, paste all of `supabase/schema.sql`, click **Run**.
3. **Authentication → URL Configuration**: set *Site URL* to `https://cre-ed.com` and add `https://cre-ed.com/**` to *Redirect URLs*.
4. **Authentication → Providers → Email**: leave on. Decide whether "Confirm email" is on (recommended) and, under *SMTP Settings*, add your own sender so emails come from CRE-Ed.
5. **Project Settings → API**: copy the *Project URL* and the *anon public* key.

## 2. Put the keys in `assets/config.js`
```js
SUPABASE_URL: "https://YOUR-PROJECT.supabase.co",
SUPABASE_ANON_KEY: "YOUR-ANON-KEY",
```
The anon key is meant to be public; the database rules (Row Level Security) in `schema.sql` protect the data.
As soon as these are filled in, demo mode switches off by itself.

## 3. Upload the 12 videos (private)
```
npm i @supabase/supabase-js
SUPABASE_URL=https://YOUR-PROJECT.supabase.co SUPABASE_SERVICE_ROLE_KEY=YOUR-SERVICE-KEY node scripts/upload-episodes.mjs
```
(Service key: Project Settings → API → *service_role*. Keep it secret and never put it in the website.)
The videos live in a private bucket. Only logged-in users can download one: Week 1 for any free account, all 12 for Offer 1 members.

## 4. Stripe products (use Test mode first)
Create three **prices in CAD**:
| Name | Type | Amount |
|---|---|---|
| Become a Commercial Realtor in 90 Days | One-time | $797 |
| Analyze and Find Your First Commercial Deal in 90 Days (full) | One-time | $1,997 |
| Analyze and Find Your First Commercial Deal in 90 Days (3 payments) | Recurring monthly | $666 |

Copy each price's ID (starts with `price_`). Consider turning on **Stripe Tax** for HST.

## 5. Deploy the two functions
Install the Supabase CLI, then from this folder:
```
supabase login
supabase link --project-ref YOUR-PROJECT-REF
supabase secrets set STRIPE_SECRET_KEY=sk_test_... SITE_URL=https://cre-ed.com \
  PRICE_BCR90=price_... PRICE_DEAL90_FULL=price_... PRICE_DEAL90_INSTALL=price_...
supabase functions deploy create-checkout
supabase functions deploy stripe-webhook --no-verify-jwt
```

## 6. Stripe webhook
Stripe → Developers → Webhooks → **Add endpoint**:
- URL: `https://YOUR-PROJECT.supabase.co/functions/v1/stripe-webhook`
- Events: `checkout.session.completed`, `invoice.paid`, `customer.subscription.deleted`, `charge.refunded`
- Copy the *signing secret* (`whsec_...`) and run: `supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...`

The 3-payment plan stops billing automatically after the third payment, and access stays.

## 7. Publish the website
Drag this whole folder (without `node_modules`) into Cloudflare Pages, Netlify or Vercel, then add the custom domain `cre-ed.com`.
Switch the DNS only when you're happy with the new site; the old Lovable site keeps running until then, so there's no downtime.
Then cancel the Lovable subscription. The "Edit with Lovable" badge disappears with it.

## 8. Go live with Stripe
Repeat steps 4–6 with Live-mode keys and prices (update the secrets), then do one real $797 purchase and refund it.

## 9. Savannah (the AI assistant) and social / phone login
- **Savannah:** get an API key at console.anthropic.com, then
  `supabase secrets set ANTHROPIC_API_KEY=sk-ant-...` and `supabase functions deploy savannah`.
  Only paying members can use it, capped at 40 questions a day each (change with `DAILY_LIMIT`). Expect a few cents of API cost per member per month.
  Until you do this, the Ask Savannah box shows an error in live mode.
- **Google / Apple / Facebook login:** Supabase → Authentication → Providers → switch each on and paste the client ID/secret from the Google, Apple and Meta developer consoles.
  Hide any button you don't want by deleting its `<button class="soc" ...>` line in `login.html` (or in `site/pages2.py` before regenerating).
- **Phone (SMS) login:** Supabase → Authentication → Providers → Phone, with a Twilio account. Optional.

## Fill in the blanks (assets/config.js)
`SOCIAL` (TikTok, Instagram, LinkedIn URLs), `BOOKING_URL` (your calendar link for $120/hour calls), `LIVE_QA` (the next live Q&A dates and replay links), `HST` (your HST number; hidden while empty) and `BOOK_LINKS` (a Stripe Payment Link or Amazon link per book).

## Everyday tasks
- **Read coach submissions and daily check-ins:** Supabase → Table Editor → `submissions` (and `contact_messages`).
- **Give someone free access** (comp, refund replacement): Table Editor → `entitlements` → insert row: `user_id` (copy from Authentication → Users), `offer` = `bcr90` or `deal90`, `status` = `active`.
- **Add a free lesson video:** put the player file in `episodes/` named `free-02.html`, run the upload script, then add one line to `items` in `assets/library.js` (copy the `free-01` line; set `id`, `title`, `desc`, `href: '#/lesson/free-02'` and `file`). Free lessons are open to every signed-in member.
- **Replace a video:** re-run the upload script with the new file in `episodes/`.
- **Add an Offer 2 lesson video:** upload the file to the private `episodes` bucket named `deal-01.html`, `deal-02.html`..., then set `video: 'deal-01.html'` on that lesson in `assets/offer2.js`. The "Video coming soon" tag disappears for that lesson. Lesson titles, summaries and minutes are also in `assets/offer2.js`.
- **Hero photo:** the home page uses `assets/skyline.svg`. To use your own photo, save it as `assets/hero.jpg` and change `skyline.svg` to `hero.jpg` in the `.visual` and `.auth-side` rules of `assets/site.css`.
- **Real book covers / photo:** the images in `assets/` were cropped from screenshots. Replace `book-buy-cre.png`, `book-cashflow.png`, `book-lease.png` and `lijoy.jpg` with the originals (same file names).

## Your email list
Every sign-up is saved in Supabase: Table Editor → `profiles` (columns `email`, `full_name`, `marketing_ok`, `created_at`). `marketing_ok` is true when the person ticked "Email me free lessons, deal tips and reminders" (or agreed later from the banner in their library). Export the rows with `marketing_ok = true` as CSV and import them into your email tool (Mailchimp, MailerLite, Kit, etc.) to send reminders and new content. Only email people with `marketing_ok = true` (Canada's anti-spam law, CASL, needs their consent).

## Free library
Edit `assets/library.js` (the four items and the glossary). Free tools are the worksheets listed in `FREE_SHEETS` in `assets/config.js`; the free video is Week 1 (`FREE_WEEKS`). Everything in the library needs a free account.

## Pages
Home and Log in are public. Everything else needs a free account (the pages redirect to Log in): `programs` (Coaching and the two offers), `about` (Meet Lijoy, books, contact) and `members` (Learn).
Learn has three compartments: Free Library (everyone), Offer 1 and Offer 2 (unlocked after purchase). Weeks, modules, worksheets, the Deal Analyzer and the coaching desk open inside it. Account settings are in the account menu (top right).
Note: this is a static site, so the page text of Coaching and Meet Lijoy is technically in the files. The protected parts (videos, worksheets, progress, purchases) are enforced by Supabase.

## Sign-in with Google and Apple (live site)
In demo mode the Google and Apple buttons open a practice sign-in box. On the live site the same buttons send people to Google's and Apple's own sign-in pages. To switch that on:
1. **Google:** Google Cloud Console → APIs and Services → Credentials → Create OAuth client ID (Web). Under Authorized redirect URIs paste the callback URL shown in Supabase → Authentication → Providers → Google. Copy the Client ID and Client secret into that Supabase screen and turn Google on.
2. **Apple:** Apple Developer account → Identifiers → create a Services ID with "Sign in with Apple", add your domain and the Supabase callback URL, and create a key. Paste the Services ID, Team ID, Key ID and the key into Supabase → Authentication → Providers → Apple and turn it on. (Apple needs a paid Apple Developer membership.)
3. Supabase → Authentication → URL Configuration: set **Site URL** to your live address and add `https://your-domain/members.html` under Redirect URLs.
4. Test with a second Google account. The email you signed in with appears on My account.

## Payments
With the Supabase values filled in, **Start Offer** opens Stripe's own checkout page. Use Stripe test mode and the card 4242 4242 4242 4242 until you are ready to go live (step 8). The owner email in `OWNER_EMAILS` always gets every program free, so test paying with a different email.
