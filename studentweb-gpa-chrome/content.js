// Maps letter grades to numeric values (ECTS scale)
const GRADE_VALUES = { A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 };

function letterToValue(letter) {
  return GRADE_VALUES[letter.trim().toUpperCase()] ?? null;
}

function valueToLetter(value) {
  if (value >= 4.5) return 'A';
  if (value >= 3.5) return 'B';
  if (value >= 2.5) return 'C';
  if (value >= 1.5) return 'D';
  if (value >= 0.5) return 'E';
  return 'F';
}

function parseCredits(text) {
  // Norwegian uses comma as decimal separator
  const num = parseFloat(text.trim().replace(',', '.'));
  return isNaN(num) ? null : num;
}

function extractRowData(row) {
  // Full-grade rows use spans without the vurderingsdelInfo class
  const gradeSpan = row.querySelector(
    'td.col6Resultat .infoLinje span:not(.vurderingsdelInfo)'
  );
  const creditSpan = row.querySelector('td.col7Studiepoeng span');
  const codeEl = row.querySelector(
    'td.col2Emne .column-info .infoLinje[aria-hidden="true"]'
  );

  if (!gradeSpan || !creditSpan) return null;

  const gradeText = gradeSpan.textContent.trim();
  const gradeValue = letterToValue(gradeText);
  const credits = parseCredits(creditSpan.textContent);

  // Skip pass/fail grades (Bestått, Godkjent, etc.) and rows with no credits
  if (gradeValue === null || credits === null || credits <= 0) return null;

  return {
    code: codeEl ? codeEl.textContent.trim() : '?',
    grade: gradeText.toUpperCase(),
    gradeValue,
    credits,
  };
}

function calculateGPA() {
  // resultatTop = final grade for a course that has sub-components
  // none        = final grade for a standalone course (no sub-components)
  const rows = document.querySelectorAll('tr.resultatTop, tr.none');
  const entries = [];

  for (const row of rows) {
    const data = extractRowData(row);
    if (data) entries.push(data);
  }

  if (entries.length === 0) return null;

  const totalCredits = entries.reduce((sum, e) => sum + e.credits, 0);
  const weightedSum = entries.reduce((sum, e) => sum + e.gradeValue * e.credits, 0);
  const gpa = weightedSum / totalCredits;

  return { gpa, entries, totalCredits };
}

function buildGPARow(result) {
  const { gpa, entries, totalCredits } = result;
  const letter = valueToLetter(gpa);
  const tooltip = entries
    .map((e) => `${e.code}: ${e.grade} (${e.credits} stp)`)
    .join('\n');

  const row = document.createElement('tr');
  row.id = 'gpa-calculator-row';
  row.title = tooltip;

  const baseCell = 'padding:10px 8px;color:#fff;';

  row.style.cssText = [
    'background:#1a472a',
    'color:#fff',
    'font-weight:bold',
    'border-bottom:3px solid #0d2b17',
    'cursor:default',
  ].join(';');

  row.innerHTML =
    `<td class="col1Semester firstColumn" colspan="5" style="${baseCell}">` +
    `Vektet snitt — ${entries.length} emner · ${totalCredits} studiepoeng` +
    `</td>` +
    `<td class="col6Resultat textAlignRight" style="${baseCell}font-size:1.1em;">` +
    `${gpa.toFixed(2)}&thinsp;/&thinsp;5.00 &nbsp;(${letter})` +
    `</td>` +
    `<td class="col7Studiepoeng textAlignRight" style="${baseCell}">` +
    `${totalCredits}` +
    `</td>`;

  return row;
}

function run() {
  if (document.getElementById('gpa-calculator-row')) return;

  const tbody = document.querySelector('table.table-standard tbody');
  if (!tbody) return;

  const result = calculateGPA();
  if (!result) return;

  tbody.prepend(buildGPARow(result));
}

// Run once on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', run);
} else {
  run();
}

// Re-run if the page updates content via AJAX (the site uses XHR to refresh the table)
const observer = new MutationObserver(() => {
  if (!document.getElementById('gpa-calculator-row')) run();
});
observer.observe(document.body, { childList: true, subtree: true });
