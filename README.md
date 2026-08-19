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

The "Core" pool option in the app is computed dynamically as `A1`+`A2`+`B1` (100 verbs) — see `buildPool()` in `index.html`.

`verbs/regular.json` (200 entries) still uses the older frequency-tier shape (`rank`, 1 = most common), sliced into Top 25/50/100/All by the regular-verb pool selector — this hasn't had the same research pass as the irregular list yet.

For regular verbs, `pastSimple` and `pastParticiple` are always equal — kept as separate fields so the app can treat both lists uniformly. One irregular entry ("be") has multiple accepted answers, written as `"was/were"` — `isCorrectAnswer()` in `index.html` splits on `/` and accepts any listed form.

## Known follow-up

- `regular.json`'s Top 25/50/100/All tiers are still the original unverified one-pass ranking — the same Oxford 3000/5000 CEFR treatment applied to `irregular.json` could be applied there too.
- CEFR levels are per-lemma, not per-inflected-form, so a single tag applies to base/past-simple/past-participle together (e.g. "bear" is tagged by its verb sense as a whole, which doesn't capture that "borne" specifically is rarer than "bore"). "born" (the common birth-sense past participle) isn't in the dataset at all — only the formal "borne" is; adding "born" as an accepted alternate answer is a still-open data/UX decision.
