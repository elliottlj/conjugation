# Verb Conjugation Practice

A single-page practice tool for past simple / past participle verb forms — irregular verbs by default, with an option to mix in regular verbs. No build step, no framework: everything lives in `index.html`, styled to match the other `liamteacher.com` sites.

## Running locally

Don't open `index.html` by double-clicking it — that loads it as a `file://` URL, and browsers block `fetch()` of local files under `file://`, so the verb data (`verbs/irregular.json` / `verbs/regular.json`) can't load and the Start button will say "Could not load verb data".

Instead, serve the folder over plain HTTP with the included script (requires [Node.js](https://nodejs.org), no packages to install):

```
node serve.js
```

Then open **http://localhost:8080** in your browser. Leave the terminal window open while you're using the site; press Ctrl+C in it to stop the server when you're done.

## Data files

`verbs/irregular.json` (183 entries) has a `cefr` field (`A1`–`C2`) instead of a frequency `rank`, sourced directly from Oxford University Press's official "Oxford 3000 by CEFR level" and "Oxford 5000 by CEFR level" word lists (verb sense specifically, not noun/adjective senses of the same headword — e.g. "bear" the animal is A2 but "to bear" the verb is B2). Verbs absent from both official lists entirely are tagged `C2` (genuinely rare/archaic, e.g. dwell, partake, slay, stride, tread) or `C1` if they're a transparent prefix-compound of an already-listed base verb that Oxford just doesn't itemize separately (e.g. overtake, rewrite, misunderstand):

```json
{ "base": "go", "pastSimple": "went", "pastParticiple": "gone", "cefr": "A1" }
```

The setup screen's "Levels to test" checkboxes (A1/A2/B1/B2/C1/C2, defaulting to A1+A2+B1 = 100 verbs) select directly by `cefr` — see `buildPools()` in `index.html`.

`verbs/regular.json` (200 entries) also has a `cefr` field now, tagged the same way as `irregular.json`. The array order still reflects the original frequency ranking (most common first), though nothing in the app currently depends on that order — regular verbs are now selected by `cefr` rather than by frequency tier (see below). Two entries needed a judgment call rather than a direct source match: `colour` (only the noun sense "colour n." is itemized in Oxford's list, no separate verb entry — tagged `A1` to match the noun) and `bathe` (absent from both Oxford lists entirely, at any level or form — tagged `C2`, the same treatment as the irregular list's archaic tier, since British English favours "have a bath" over "to bathe").

When "Include regular verbs" is on, the regular pool is filtered to whichever CEFR levels are checked (same set as the irregular pool), and each round draws roughly 60% irregular / 40% regular cards (`IRREGULAR_RATIO` in `buildQueue()`), topping off from whichever pool has spare cards if the other runs short.

For regular verbs, `pastSimple` and `pastParticiple` are always equal — kept as separate fields so the app can treat both lists uniformly. One irregular entry ("be") has multiple accepted answers, written as `"was/were"` — `isCorrectAnswer()` in `index.html` splits on `/` and accepts any listed form.

## Printable verb table

`pdf/irregular-verbs-core.pdf` and `pdf/irregular-verbs-all.pdf` are static, pre-generated PDFs of the irregular verb list — Core (A1-B1, 100 verbs, fits one page) and All (183 verbs, two pages), both two equal-width columns per page, no CEFR column (meant for printing/reference, not a mirror of the on-site table). Not generated on the fly by the app — they're build-time artifacts, regenerated manually when the verb data changes:

```
node pdf/generate.js
```

This writes `pdf/irregular-verbs-core.html` and `pdf/irregular-verbs-all.html` from `verbs/irregular.json` (100 verbs per page cap, so All automatically spills onto a second page's worth of two columns rather than cramming more columns onto one page — see `VERBS_PER_PDF_PAGE` in `pdf/generate.js`). Render each to its final PDF with Playwright (`npx playwright pdf pdf/irregular-verbs-core.html pdf/irregular-verbs-core.pdf`, same for `-all`) or a browser's own "Print to PDF". Not yet linked from the site - where to put a download button is still an open decision.

## Known follow-up

- CEFR levels are per-lemma, not per-inflected-form, so a single tag applies to base/past-simple/past-participle together (e.g. "bear" is tagged by its verb sense as a whole, which doesn't capture that "borne" specifically is rarer than "bore"). "born" (the common birth-sense past participle) isn't in the dataset at all — only the formal "borne" is; adding "born" as an accepted alternate answer is a still-open data/UX decision.
