# The Boarding Pass Diary ✈

A single-page web app for turning your trips into keepsake boarding-pass stubs. Type in a flight, pick the real airport and airline codes from live autocomplete, and stamp a styled pass into your diary. Each pass can be downloaded as a PNG or PDF, or the whole diary can be exported as one PDF.

Nothing is stored on a server — passes live only in the current browser tab, so downloading a stub is the only way to keep it.

## Features

- **City / airport autocomplete** backed by a built-in list of ~60 major airports, enriched at runtime with a ~29,000-airport dataset when the network is available.
- **Airline autocomplete** with IATA codes, plus curated brand colors that tint each pass.
- **Approximate codes** when you type a place or airline that isn't in the dataset (shown with a `~` marker).
- **Realistic boarding-pass design** — perforated stub, barcode, tape, "boarded" stamp, and a slight random tilt for a scrapbook feel.
- **Export options** — save any single pass as PNG or PDF, or export the entire diary as a multi-page PDF.
- Responsive layout, reduced-motion support, and keyboard navigation in the autocomplete lists.

## Project structure

```
boarding-pass-diary/
├── index.html    # Markup only
├── styles.css    # All styling
├── script.js     # All app logic (autocomplete, rendering, exports)
└── README.md
```

External dependencies are loaded from CDNs in `index.html`:

- [html2canvas](https://html2canvas.hertzen.com/) — renders a pass to a canvas for image export
- [jsPDF](https://github.com/parallax/jsPDF) — builds the PDF downloads
- Google Fonts — *Fraunces*, *Space Mono*, and *Work Sans*

At runtime `script.js` also fetches two open datasets to enrich the built-in lists:

- Airports: `mwgg/Airports` on GitHub
- Airlines: `jpatokal/openflights`

If either fetch fails, the app falls back to its built-in lists and keeps working.

## Running it

Because the page loads `styles.css` and `script.js` as separate files, serve all three from the same folder.

**Option 1 — open the file directly**

Double-click `index.html`. This works in most browsers.

**Option 2 — run a local server** (recommended, avoids any relative-path or CORS quirks)

```bash
# Python 3
python3 -m http.server 8000

# or Node
npx serve
```

Then visit `http://localhost:8000`.

## Usage

1. Enter the passenger name.
2. Start typing a **From** and **To** city or airport and pick from the suggestions.
3. Type the **airline** and pick it to get the code and brand colors.
4. Add flight number, date, and any optional details (class, gate, seat, boarding time, a memory note).
5. Click **Stamp it into the diary**.
6. On any pass, use **Save PNG**, **Save PDF**, or **Remove**. Use **Export whole diary as PDF** to save them all at once.

## Notes

- Passes are **not persisted** — refreshing the tab clears the diary. Download what you want to keep.
- The app needs an internet connection for fonts, the export libraries, airline logos, and the live dataset enrichment. Core functionality still works offline using the built-in lists once the page and CDN scripts are cached.
- No build step or package installation is required — it's plain HTML, CSS, and JavaScript.
