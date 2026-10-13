const r = state.records.find((x) => x.id === id);
    if (r) { fillForm(r); $('form').scrollIntoView(); }
  } else if (confirm('Delete this transaction?')) {
    deleteRecord(id);
    announce('Transaction deleted.');
    refresh();
  }
});

// ----- Settings -----
$('settings-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const err = $('settings-error');
  const cap = Number($('cap').value);
  const eur = Number($('rate-EUR').value);
  const rwf = Number($('rate-RWF').value);
  const categories = $('categories').value.split(',').map(normalize).filter(Boolean);

  if (!(cap >= 0) || !(eur > 0) || !(rwf > 0)) { err.textContent = 'Cap must be 0 or more and rates must be above 0.'; return; }
  const bad = categories.find((c) => !rules.category.test(c));
  if (bad || !categories.length) { err.textContent = `Invalid category: "${bad ?? ''}". Use letters, spaces or hyphens.`; return; }

  err.textContent = '';
  updateSettings({ cap, display: $('display').value, rates: { USD: 1, EUR: eur, RWF: rwf }, categories });
  renderCategories();
  refresh();
  announce('Settings saved.');
});

// ----- Import / export -----
$('export-btn').addEventListener('click', () => { exportJSON(state.records); announce('Exported JSON file.'); });
$('import').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const problem = validateImport(data);
    if (problem) throw new Error(problem);
    setRecords(data);
    $('import-error').textContent = '';
    refresh();
    announce(`Imported ${data.length} records.`);
  } catch (x) {
    $('import-error').textContent = 'Import failed: ' + x.message;
    announce('Import failed.');
  }
  e.target.value = '';
});

// ----- Start up (load seed.json the first time) -----
if (!hasData()) {
  try { setRecords(await (await fetch('seed.json')).json()); } catch { /* start empty */ }
}
renderCategories();
renderSettings();
refresh();