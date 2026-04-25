# Pearl Beach Cottages — Print Materials

Self-contained printable HTML files for the in-cottage AI concierge QR codes.

## Files

| File | What it is |
|---|---|
| `pearl-beach-lakehouse.html` | Business card (3.5" × 2") + Placard (5" × 7") for Pearl Beach Lakehouse |
| `lakehurst-bungalow.html` | Business card (3.5" × 2") + Placard (5" × 7") for Lakehurst Bungalow |

Each file has two pages:
1. **Business card** — for guest welcome packs, leave-behinds, etc.
2. **Placard** — frame and place inside the cottage (kitchen counter, fridge, entryway)

## How to print

### Quick path (home printer)
1. Double-click the HTML file → opens in your default browser (Chrome recommended).
2. The QR code generates automatically.
3. Press **Ctrl+P** (Cmd+P on Mac).
4. In the print dialog:
   - **Destination:** your printer
   - **Paper size:** the dialog should auto-detect 3.5×2 and 5×7 page sizes from the CSS. If your printer can't handle these, choose Letter and select **"Fit to page"**.
   - **Margins:** None (or Default)
   - **Background graphics:** ON (this is the brand-colored card; without it the dark green won't print)
5. Print.

### Recommended (print shop)
1. Open the file in Chrome.
2. **Ctrl+P → Destination → "Save as PDF"** to generate a press-ready file.
3. Send the PDF to a print shop.
   - **Cards:** 14pt+ matte cardstock, double-sided OK (back can be blank or matching color block)
   - **Placards:** 100lb cover or have them laminated for cottage use

## Customizing the layout

Both files share the same structure. The cottage-specific bits are:
- Title (`Pearl Beach Lakehouse` or `Lakehurst Bungalow`)
- The URL encoded in the QR code (set in the inline JS at the bottom — `URL_TO_ENCODE`)

If you ever change cottage URLs, update `URL_TO_ENCODE` in **both** files.

## QR code

QR codes are generated client-side by the `qrcode-generator` library (loaded from a CDN the first time you open the file, then cached). No external service is contacted at print time once the page has loaded once.

If you want a fully offline copy:
1. Open the HTML file in Chrome.
2. **Ctrl+S** → "Webpage, complete" — saves the page bundled with all assets.
3. The saved version will work without internet forever.

## QR code quality check

After printing one card, **scan it with your phone camera** before printing the rest. The QR should:
- Resolve in under 2 seconds
- Land you on the correct concierge URL (e.g., `pearlbeachcottages.com/concierge/pearl-beach-lakehouse`)

If scanning is slow, the print resolution may be too low. Try:
- A higher print quality setting
- Printing on lighter cardstock
- Increasing the QR size in CSS (`.bcard-qr` width/height for cards, `.placard-qr` for placards)

## Color reference (for designers)

| Token | Hex | Use |
|---|---|---|
| Honey Oak | `#C4956A` | Accents, dividers, eyebrow text |
| Honey Oak Dark | `#A67B4F` | Hover states (UI), header strap |
| Forest Sage | `#5D7566` | Card background gradient (dark) |
| Pine Dark | `#3D4F47` | Body text, deep accents |
| Warm Cream | `#FBF8F4` | Placard background |
| Seashell | `#F5F0E8` | Pill chip background |
| Linen | `#EDE8E0` | Borders |
| Driftwood | `#B5A99A` | Muted text |

Fonts: Lora (serif, headings) + Source Sans 3 (sans, body).
