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

`verbs/irregular.json` (183 entries) has a `core` boolean instead of a frequency `rank` — `true` for the ~100 verbs an A2/B1 learner should prioritize for everyday use, `false` for the rest (advanced/formal/literary verbs not yet split into their own category — see below). Boundary was set by cross-referencing actual ESL frequency/level references (e.g. englishpage.com's "100 Most Common English Irregular Verbs", speakspeak's A1-A2 70-verb list), not guessed:

```json
{ "base": "go", "pastSimple": "went", "pastParticiple": "gone", "core": true }
```

`verbs/regular.json` (200 entries) still uses the older frequency-tier shape (`rank`, 1 = most common), sliced into Top 25/50/100/All by the regular-verb pool selector — this hasn't had the same research pass as the irregular list yet.

For regular verbs, `pastSimple` and `pastParticiple` are always equal — kept as separate fields so the app can treat both lists uniformly. One irregular entry ("be") has multiple accepted answers, written as `"was/were"` — `isCorrectAnswer()` in `index.html` splits on `/` and accepts any listed form.

## Known follow-up

- The 83 non-core irregular verbs are currently one undifferentiated bucket. Next pass: split into "Advanced" (B2/C1, still in real use — e.g. undergo, withstand, override) vs "Archaic/Literary" (rare/dated regardless of level — e.g. partake, dwell, forgo, tread, stride, slay, strive) using the same real-source approach as the core cut, not guesswork.
- `regular.json`'s Top 25/50/100/All tiers are still the original unverified one-pass ranking — same research treatment could be applied there too.
