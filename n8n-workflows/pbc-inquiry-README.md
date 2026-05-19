# PBC Inquiry — n8n Workflow Setup

This is the n8n side of the direct-booking inquiry pipeline. The Cloudflare
Pages Function at `functions/api/inquiry.ts` POSTs to this webhook with a
verified inquiry payload; this workflow responds 200, sends an HTML email
notification, and appends a row to the Inquiries sheet.

```
Pages Function /api/inquiry
   │  (Turnstile verified, KV race-check passed, KV log written)
   ▼
[Webhook]  ──▶ [Respond OK]  (200 immediately, Pages Function unblocks)
   │
   └──▶ [Derive Presentation Fields]  (Code/JS — formats dates, builds links)
            │
            ├──▶ [Send Notification Email]   (Gmail, HTML, replyTo guest)
            └──▶ [Log to Inquiries Sheet]    (Google Sheets append row)
```

The workflow file is at `n8n-workflows/pbc-inquiry.json`.

---

## 1. Manual setup before importing

Do these two things first so the import + first run doesn't fail.

### a. Add an "Inquiries" tab to the Leads spreadsheet

Open: <https://docs.google.com/spreadsheets/d/1Z8Bu28jfr1w_Kiz5By-6jpZk_uyUVzLTqcCVt1udygk>

Right-click any existing tab → **Insert sheet** → name it **exactly** `Inquiries`
(case-sensitive, no quotes).

Paste these column headers into row 1, in this exact order:

| A | B | C | D | E | F | G | H | I | J | K | L | M | N |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Timestamp | Property | Check-in | Check-out | Nights | Guests | Name | Email | Phone | Message | Status | Notes | Booking value | Inquiry ID |

Quick paste — copy the line below, click cell A1, paste:

```
Timestamp	Property	Check-in	Check-out	Nights	Guests	Name	Email	Phone	Message	Status	Notes	Booking value	Inquiry ID
```

(Tab-separated — Google Sheets will split it across columns.)

You can freeze row 1 (View → Freeze → 1 row) and bold the headers; the workflow
doesn't care, just don't rename or reorder the columns.

### b. Confirm n8n credentials are fresh

In your n8n cloud workspace, open **Credentials** in the left sidebar and
check that these two credentials don't show "Reconnect" or expired-token
banners:

1. **`Gmail account`** — used by the existing pbc-contact-form workflow.
   Open it, click **Test step**. If it fails, hit **Reconnect**.
2. **`Google Sheets account`** — same. Open, **Test step**, **Reconnect** if needed.

If either one has rotated, the import below will still work but the
workflow will throw on first execution.

---

## 2. Import the workflow

1. In n8n, click **Workflows** → **+ Add workflow** (top right) →
   **Import from File…**
2. Select `n8n-workflows/pbc-inquiry.json` from your local clone.
3. n8n opens the canvas with five nodes. You'll see warning badges on
   **Send Notification Email** and **Log to Inquiries Sheet** — those are
   the credential placeholders below.

### Attach credentials

**Send Notification Email** node:

1. Click the node to open its panel.
2. Under **Credential to connect with**, the dropdown shows
   `REPLACE_WITH_GMAIL_CRED_ID — Gmail account (not found)`.
3. Click the dropdown → select your existing **`Gmail account`** credential.
4. Close the panel. The warning badge disappears.

**Log to Inquiries Sheet** node:

1. Click the node.
2. Under **Credential to connect with**, replace
   `REPLACE_WITH_SHEETS_CRED_ID — Google Sheets account (not found)` with
   your existing **`Google Sheets account`** credential.
3. Verify the **Document** field shows "Leads" as the cached name; if
   blank, click the dropdown and pick the Leads spreadsheet.
4. Verify the **Sheet** field shows `Inquiries`. (If you haven't created
   the tab yet, go back to step 1a.)

### Save (don't activate yet)

Click **Save** at the top right. Leave the toggle in the upper right set to
**Inactive** for now — we'll activate after the smoke test.

---

## 3. Webhook URL

After saving, click the **Webhook** node and look at the **Production URL** field:

```
https://zax76.app.n8n.cloud/webhook/pbc-inquiry
```

Confirm this matches `N8N_INQUIRY_WEBHOOK_URL` in
`<repo>/wrangler.toml`:

```toml
[vars]
N8N_INQUIRY_WEBHOOK_URL = "https://zax76.app.n8n.cloud/webhook/pbc-inquiry"
```

If the URL differs (different n8n account, different path), edit
`wrangler.toml` to match and redeploy Pages — otherwise the Pages Function
will POST into the void.

There's also a **Test URL** for one-off curl tests during development. The
production URL only works when the workflow is **active**.

---

## 4. Activate + smoke test

1. Flip the workflow toggle to **Active** (top right of n8n canvas).
2. Open a **preview deploy** of the Pages site (push your branch, get a
   Cloudflare preview URL like `pbc-xxxx.pages.dev`).
3. Navigate to `/cottages/pearl-beach-lakehouse`.
4. Pick a check-in/out range on the calendar that is **not** in a booked
   range (any open 2-3 night window in late 2026 works).
5. Fill the inquiry form with your own real email + phone (you need to
   receive the notification email to verify it). Tick the consent box,
   complete the Turnstile widget, click **Send Inquiry**.
6. You should immediately see the "Thanks, {name}." confirmation card —
   that confirms the Pages Function ran end-to-end.

### Verify three things

#### (a) Email arrived

Notification email is sent to **both** `zckpearson@gmail.com` **and**
`jjpea1@gmail.com`. Check either inbox for an email with subject like:

```
Inquiry: Pearl Beach Lakehouse · Oct 15–Oct 18 · Your Name
```

Open it. Confirm:
- Property name in sage `#5D7566`
- Long dates render: e.g. `Wednesday, October 15, 2026 → Saturday, October 18, 2026`
- Nights and guests on the line below
- Guest details in the cream box with mailto: and tel: links — **click both**:
  - The mailto: should open a "Re: Pearl Beach inquiry (inquiry:…:abc123)"
    compose
  - The tel: should be a clickable link on mobile
- Message renders correctly (line breaks preserved, no HTML entities visible)
- "Block these dates on VRBO →" button in gold

#### (b) Sheets row appended

Open the Leads spreadsheet → **Inquiries** tab. A new row should appear
with all 14 columns filled. Status should be `Open`. Notes and Booking
value should be empty. The Inquiry ID should match the one shown in the
confirmation card on the website.

#### (c) "Block these dates on VRBO" link lands on the right calendar

Click the button in the test email. It should open VRBO's owner calendar
for the matching property.

What you might see instead:
- Login screen — that's fine, log in once, the link should resolve correctly afterward
- VRBO marketing homepage or 404 — the path pattern in the Code node is wrong; see "If the VRBO link is wrong" below

The link is constructed in the **Derive Presentation Fields** node:

```js
const vrboCalendarUrl =
  `https://www.vrbo.com/p/calendar/321.${item.vrbo_id}.${item.vrbo_id}`;
```

`item.vrbo_id` is `122526` for Pearl Beach Lakehouse and `238763` for
Lakehurst Bungalow (from `src/config/constants.ts`). The `321.` prefix is
the VRBO account-level identifier for this owner — it's shared across
both properties for this account. The listing id appears twice in the
path (this is VRBO's actual pattern, not a typo).

Final URLs:
- Pearl Beach Lakehouse: `https://www.vrbo.com/p/calendar/321.122526.122526`
- Lakehurst Bungalow:    `https://www.vrbo.com/p/calendar/321.238763.238763`

#### If the VRBO link is wrong

VRBO occasionally changes their owner-dashboard URL structure. If a
future test inquiry lands on the wrong page:

1. Manually navigate to your VRBO owner calendar for the property.
2. Copy the URL from the address bar.
3. In n8n, open **Derive Presentation Fields**.
4. Edit the `vrboCalendarUrl` template to match VRBO's real pattern.
   Substitute `${item.vrbo_id}` where the property id appears, and update
   any account-level prefix if VRBO has rotated yours.
5. **Save** the workflow, then send one more test inquiry and re-verify.

Older patterns VRBO has used (kept here as a paper trail of breakage we've seen):
- `https://www.vrbo.com/spm/dashboard/listings/{vrbo_id}/calendar` — never landed correctly for this account
- `https://www.vrbo.com/{vrbo_id}` followed by clicking "Calendar" — works without a deep link, but adds a click

Don't forget to commit any change here back to `pbc-inquiry.json` so a
re-import doesn't undo it. Export the workflow from n8n
(**•••** menu → **Download**) and overwrite the file in the repo.

---

## 5. Failure modes to expect later

| What you see | What it means | What to do |
|---|---|---|
| Pages Function returns 200, but no email | Workflow inactive, or Gmail credential expired | Toggle Active, re-test Gmail credential |
| Email arrives, but no Sheets row | "Inquiries" tab missing or renamed | Re-create the tab with the exact name and headers from §1a |
| Pages Function returns 200, n8n shows no execution | Webhook URL mismatch in `wrangler.toml` | Verify §3, redeploy Pages |
| Workflow execution fails on "Derive Presentation Fields" | Likely a malformed `submitted_at` or `check_in` from the payload | Check `INQUIRIES` KV record — the inquiry is still durably captured; re-trigger by replaying the payload via webhook Test URL |
| Sheets append fails with "Sheet not found" | Same as the tab-missing case | §1a |

The Pages Function returns 200 to the client **even if n8n fails entirely**.
Every inquiry is also written to the `INQUIRIES` KV namespace before the
n8n forward. So a broken workflow loses notifications, not inquiries.
Recover by listing KV keys: `wrangler kv key list --binding=INQUIRIES`.

---

## 6. Modifying the workflow later

If you change the workflow in n8n's UI (e.g., add a Slack notification, tweak
the email template):

1. Test thoroughly in n8n.
2. From the workflow canvas, click **•••** (top right) → **Download**.
3. Save the file at `n8n-workflows/pbc-inquiry.json`, replacing the existing one.
4. Commit. Future re-imports will reproduce the change.
