// Regenerates the printable irregular-verb PDFs' intermediate HTML from
// verbs/irregular.json.
// Run: node pdf/generate.js
// Then render each HTML file to PDF (not part of the site's runtime - this
// is a one-off build step, done locally with Playwright):
//   npx playwright pdf pdf/irregular-verbs-core.html pdf/irregular-verbs-core.pdf
//   npx playwright pdf pdf/irregular-verbs-all.html pdf/irregular-verbs-all.pdf
// (or open the HTML in a browser and use its own "Print to PDF")

const fs = require('fs');
const path = require('path');

const verbs = require('../verbs/irregular.json');
const CORE_LEVELS = ['A1', 'A2', 'B1'];

function formatAnswer(field) {
  return field.split('/').join(' or ');
}

// verbs per page = COLUMNS_PER_PAGE * ROWS_PER_COLUMN, tuned so the Core
// (100-verb) table fills one page and the All (183-verb) table spills onto
// a second, both still at 2 columns per page rather than cramming more
// columns onto a single page.
const COLUMNS_PER_PAGE = 2;
const ROWS_PER_COLUMN = 50;
const VERBS_PER_PDF_PAGE = COLUMNS_PER_PAGE * ROWS_PER_COLUMN;

function rows(list) {
  return list.map(v => `
    <tr>
      <td class="base">${v.base}</td>
      <td>${formatAnswer(v.pastSimple)}</td>
      <td>${formatAnswer(v.pastParticiple)}</td>
    </tr>
  `).join('');
}

function table(list) {
  return `
    <table>
      <colgroup>
        <col style="width: 33.34%" />
        <col style="width: 33.33%" />
        <col style="width: 33.33%" />
      </colgroup>
      <thead>
        <tr><th>Base</th><th>Past simple</th><th>Past participle</th></tr>
      </thead>
      <tbody>
        ${rows(list)}
      </tbody>
    </table>
  `;
}

function buildHtml(title, list) {
  const pages = [];
  for (let i = 0; i < list.length; i += VERBS_PER_PDF_PAGE) {
    pages.push(list.slice(i, i + VERBS_PER_PDF_PAGE));
  }

  const pagesHtml = pages.map((pageVerbs, i) => {
    const colSize = Math.ceil(pageVerbs.length / COLUMNS_PER_PAGE);
    const col1 = pageVerbs.slice(0, colSize);
    const col2 = pageVerbs.slice(colSize);
    const isLast = i === pages.length - 1;
    return `
      <div class="page${isLast ? '' : ' page-break'}">
        <div class="header">
          <h1>${title}</h1>
          <span class="subtitle">${list.length} verbs</span>
        </div>
        <div class="columns">
          <div>${table(col1)}</div>
          <div>${table(col2)}</div>
        </div>
      </div>
    `;
  }).join('');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>${title}</title>
<style>
  @page { size: A4; margin: 14mm 12mm 12mm 12mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'DejaVu Sans', Arial, sans-serif;
    color: #1A1917;
  }
  .page-break { break-after: page; page-break-after: always; }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    border-bottom: 2px solid #1D7A7E;
    padding-bottom: 6px;
    margin-bottom: 10px;
  }
  .header h1 {
    font-size: 15pt;
    font-weight: 700;
    color: #3D2459;
  }
  .header .subtitle {
    font-size: 8.5pt;
    color: #7A756C;
  }
  .columns {
    display: flex;
    gap: 8mm;
  }
  .columns > div { flex: 1; min-width: 0; }
  table { width: 100%; table-layout: fixed; border-collapse: collapse; }
  th {
    text-align: left;
    font-size: 7pt;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: #7A756C;
    border-bottom: 1px solid #1A1917;
    padding: 2px 4px 3px;
  }
  td {
    font-size: 8.6pt;
    padding: 2.4px 4px;
    border-bottom: 1px solid #E4E1D9;
    word-break: break-word;
  }
  td.base { font-weight: 700; }
  tr:nth-child(even) td { background: #F7F6F3; }
  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    font-size: 7.5pt;
    color: #7A756C;
    border-top: 1px solid #E4E1D9;
    padding-top: 4px;
  }
</style>
</head>
<body>
  ${pagesHtml}
  <div class="footer">
    <span>liamteacher.com &nbsp;&middot;&nbsp; &copy; 2026 Liam Teacher</span>
  </div>
</body>
</html>`;
}

const core = verbs
  .filter(v => CORE_LEVELS.includes(v.cefr))
  .sort((a, b) => a.base.localeCompare(b.base));
const all = [...verbs].sort((a, b) => a.base.localeCompare(b.base));

fs.writeFileSync(
  path.join(__dirname, 'irregular-verbs-core.html'),
  buildHtml('Core Irregular Verbs (A1-B1)', core)
);
console.log(`core: written ${core.length} verbs`);

fs.writeFileSync(
  path.join(__dirname, 'irregular-verbs-all.html'),
  buildHtml('All Irregular Verbs', all)
);
console.log(`all: written ${all.length} verbs`);
