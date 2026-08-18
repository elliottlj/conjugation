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

`verbs/irregular.json` (180 entries) and `verbs/regular.json` (200 entries) share the same shape, pre-sorted ascending by `rank` (1 = most common):

```json
{ "base": "go", "pastSimple": "went", "pastParticiple": "gone", "rank": 1 }
```

For regular verbs, `pastSimple` and `pastParticiple` are always equal — kept as separate fields so the app can treat both lists uniformly. One entry ("be") has multiple accepted answers, written as `"was/were"` — `isCorrectAnswer()` in `index.html` splits on `/` and accepts any listed form.

## Not yet done

- Shared `liamteacher.com` header/footer — deliberately not wired up yet so the site can be tested standalone first (see the other sites for the pattern once ready).
- Not yet a git repo, not deployed.
