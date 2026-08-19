// Regenerates pdf/irregular-verbs-core.html from verbs/irregular.json.
// Run: node pdf/generate.js
// Then render the HTML to PDF (not part of the site's runtime - this is a
// one-off build step, done locally with Playwright):
//   npx playwright pdf pdf/irregular-verbs-core.html pdf/irregular-verbs-core.pdf
// (or open the HTML in a browser and use its own "Print to PDF")

const fs = require('fs');
const path = require('path');

const verbs = require('../verbs/irregular.json');
const CORE_LEVELS = ['A1', 'A2', 'B1'];
const core = verbs
  .filter(v => CORE_LEVELS.includes(v.cefr))
  .sort((a, b) => a.base.localeCompare(b.base));

function formatAnswer(field) {
  return field.split('/').join(' or ');
}

const half = Math.ceil(core.length / 2);
const col1 = core.slice(0, half);
const col2 = core.slice(half);

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
      <thead>
        <tr><th>Base</th><th>Past simple</th><th>Past participle</th></tr>
      </thead>
      <tbody>
        ${rows(list)}
      </tbody>
    </table>
  `;
}

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Core Irregular Verbs</title>
<style>
  @page { size: A4; margin: 14mm 12mm 12mm 12mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'DejaVu Sans', Arial, sans-serif;
    color: #1A1917;
  }
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
  .columns > div { flex: 1; }
  table { width: 100%; border-collapse: collapse; }
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
  }
  td.base { font-weight: 700; }
  tr:nth-child(even) td { background: #F7F6F3; }
  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    font-size: 7.5pt;
    color: #7A756C;
    border-top: 1px solid #E4E1D9;
    padding-top: 4px;
  }
</style>
</head>
<body>
  <div class="header">
    <h1>Irregular Verb Table &mdash; Core (A1&ndash;B1)</h1>
    <span class="subtitle">${core.length} verbs</span>
  </div>
  <div class="columns">
    <div>${table(col1)}</div>
    <div>${table(col2)}</div>
  </div>
  <div class="footer">
    <span>liamteacher.com &nbsp;&middot;&nbsp; &copy; 2026 Liam Teacher</span>
  </div>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, 'irregular-verbs-core.html'), html);
console.log(`written ${core.length} verbs (${col1.length} / ${col2.length} per column)`);
