import{
    state,
    addRecord,
    updateRecord,
    deleteRecord,
    setRecords,
    updateSettings
} from './state.js';
import{
    validateRecord, 
    validateImport,
    rules,
    normalize
}from './validators.js';
import{
    compileRegex,
    filterRecords,
    sortRecords
} from './search.js';

import{
    hasData,
    exportJSON
} from './storage.js';

import{
    renderTable,
    renderStats,
    renderCategories,
    renderSettings,
    showErrors,
    fillForm,
    clearForm,
    announce,
    rowText
} from './ui.js';

const $ =(id) => document.getElementById(id);

function refresh(){
    const q = $('search').value;
    const re = compileRegex(q, $('case-toggle').checked ? 'i' : '');
    $('regex-error').textContent =  q && !re ? 'Invalid regex pattern. Showing all recodrs.' : '';
    let rows = state.records;
    if (re) rows = filterRecords(rows, re, rowText);
    const [key, dir] = $('sort').value.split('-');
    renderTable(sortRecords(rows, key, dir), re);
    renderStats();
    $('result-count').textContent = `${rows.length} of ${state.records.length} transactions shown`
}


$('search').addEventListener('input', refresh);
$('case-toggle').addEventListener('change', refresh);
$('sort').addEventListener('change', refresh);


$('record-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const {ok, errors, value } = validateRecord({
        description: $('description').value,
        amount:$('amount').value,
        category: $('category').value,
        date: $('date').value,
    });
    showErrors(errors);
    if(!ok) {
        announce(`${Object.keys(errors).length} error(s) in the form. Please fix them.`);
        $(Object.keys(errors)[0].focus());
        return;
    }
    const id = $('rec-id').value;
    if (id) {updateRecord(id, value); announce('Transaction updated.');}
    else{
        addRecord(value);
        announce('Transaction added.');
    }
    clearForm();
    refresh();
});


$('rows'),addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if(!btn) return;
    const id = btn.dataset.id;
    if(btn.dataset.action === 'edit'){
        const r = state.records.find((x) => x.id === id);
        if (r) { fillForm(r); $('form').scrollIntoView(); }
    } else if (confirm('Delete this transaction?')) {
        deleteRecord(id);
        announce('Transaction deleted.');
        refresh();
    }
});

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

    if (!hasData()) {
        try { setRecords(await (await fetch('seed.json')).json()); } catch { /* start empty */ }
    }
    renderCategories();
    renderSettings();
    refresh();
