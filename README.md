# Voyage — The Boarding Pass Diary ✈

Turn your trips into keepsake boarding-pass stubs. Type a flight, pick real airport
and airline codes from live autocomplete, watch the pass build in a live preview,
then stamp it into your diary and download it as a PNG or PDF.

Nothing is stored on a server — passes live only in the current browser tab, so
downloading a stub is the only way to keep it.

## What's new in this version

- **Editorial "Voyage" redesign** — cream / green / orange palette, Playfair Display
  + DM Sans + DM Mono, a two-column pass with a colored stub, perforation and barcode.
- **Real boarding-pass name format** — the passenger prints as `LASTNAME, FIRSTNAME`
  (e.g. `SHARMA, AARAV`). Enter last and first name separately.
- **PNR / booking reference** — shown prominently on the stub. Leave the field blank
  and a valid 6-character record locator is generated automatically.
- **Live preview** — the pass updates as you type, before you add it to the diary.
- **Per-airline theming** — known airlines tint the pass with their brand colors;
  everything else uses the house green.
- **Reliable downloads** — the PNG/PDF export was hardened to avoid the earlier
  failures (see "Download reliability" below).

## Features

- City / airport autocomplete backed by a built-in list of ~60 major airports,
  enriched at runtime with a ~29,000-airport dataset when the network is available.
- Airline autocomplete with IATA codes and curated brand colors.
- Approximate codes when you type a place or airline not in the dataset (shown with `~`).
- Save any pass as PNG or PDF, or export the whole diary as a multi-page PDF.
- Responsive layout, reduced-motion support, keyboard navigation in the dropdowns,
  and a toast for feedback.

## Project structure

```
boarding-pass-diary/
├── index.html    # Markup + layout
├── styles.css    # All styling (Voyage theme)
├── script.js     # Autocomplete, live preview, rendering, downloads
└── README.md
```

External dependencies (loaded from CDNs in index.html):

- html2canvas — renders a pass to a canvas for image export
- jsPDF — builds the PDF downloads
- Google Fonts — Playfair Display, DM Sans, DM Mono

At runtime script.js also fetches two open datasets to enrich the built-in lists
(mwgg/Airports and jpatokal/openflights). If either fetch fails, the app falls
back to its built-in lists and keeps working.

## Running it

Keep all three files in the same folder. Because the page loads styles.css and
script.js as separate files, either open index.html directly, or serve the folder:

```bash
# Python 3
python3 -m http.server 8000
# or Node
npx serve
```

Then visit http://localhost:8000.

## Usage

1. Enter the passenger's last and first name.
2. Type the airline and pick it to get the code and brand colors.
3. Add the flight number, class, and route (From / To — pick from the suggestions).
4. Fill date, boarding time, gate, seat, terminal, and a PNR (or leave PNR blank to auto-generate).
5. Optionally add a short memory note.
6. Click "Stamp it into the diary". On any saved pass use Save PNG, Save PDF,
   or Remove — or "Export whole diary as PDF" to save them all at once.

There's also a "Fill a demo flight" button to see everything populated at once.

## Download reliability

The export path was rebuilt to fix the failures seen earlier:

- color-mix() crash — html2canvas 1.4.1 can't parse the color-mix() used on the
  stub; the capture step pre-computes an equivalent rgb() in the clone so it never throws.
- Tainted canvas — cross-origin airline logos can taint the canvas; capture probes
  for this and re-renders without the logo if needed, so the download still succeeds.
- Mobile canvas limits — capture uses scale: 2 to stay within mobile Safari's limits.
- Correct PDF image — the PDF uses a data URL (not a blob URL) for addImage.

Note: on iOS Safari the PNG/PDF may open in a new tab instead of downloading directly —
that's normal iOS behavior; long-press the file to save it.

## Notes

- Passes are not persisted — refreshing the tab clears the diary. Download what you
  want to keep.
- No build step or package installation is required — plain HTML, CSS, and JavaScript.
