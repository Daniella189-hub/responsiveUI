import{
    state,
    addRecord,
    updatedRecord,
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

const categorySelect = document.getElementById('category');
const otherWrap = document.getElementById('other-wrap');
const otherInput = document.getElementById('category-other');



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
        $(Object.keys(errors)[0]).focus();
        return;
    }
    const id = $('rec-id').value;
    if (id) {
        updatedRecord(id, value);
        announce('Transaction updated.');}
    else{
        addRecord(value);
        announce('Transaction added.');
    }
    clearForm();
    refresh();
});

$('cancel-btn').addEventListener('click', () => {
    clearForm();
    announce(
        'Edit cancelled.'
    )
});

$('rows').addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if(!btn) return;
    const id = btn.dataset.id;
    if(btn.dataset.action === 'edit'){
        const r = state.records.find((x) => x.id === id);
        if (r) { 
            openPage('add');
            history.pushState(null, '', '#add');
            fillForm(r);
        }
        } else if  (confirm ('Delete this transaction?')){
            deleteRecord(id);
            announce('Transaction deleted');
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

    
//-- Keyboard usage of the webpage
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([type="hidden"]), select, textarea';

document.addEventListener('keydown', (e) => {
    if(e.altKey || e.ctrlKey || e.metaKey) return;
    const el = document.activeElement;
    const isText = el.matches('input:not([type="checkbox"]):not([type="file"]),select, textarea');
    const isSelect = el.matches('select');

    if (e.key === 'Backspace' && !isText && !isSelect){
        e.preventDefault();
        history.back();
        return;

    }

    if(!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    if(isSelect) return; 
    if(isText && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) return;
    if(isText && el.hasAttribute('list')) return;

    const items = [...document.querySelectorAll(FOCUSABLE)]
        .filter((x) => x.offsetParent !==null);
        const i = items.indexOf(el);
        const step = e.key === 'ArrowDown' || e.key ==='ArrowRight' ? 1 : -1;
        e.preventDefault();
        items[i < 0 ? 0 : (i + step + items.length) % items.length].focus();
});

//--checking emails and github links
(function checkContactLinks(){
    const mail = document.querySelector('#about a[href^="mailto:"]');
    const gh = document.querySelector('#about a[href*="github.com"]');
    const email = mail ? mail.getAttribute('href').replace(/^mailto:/i, '') : '';
    const url = gh ? gh.getAttribute('href') : '';
    const problems = [];
    if(!rules.email.test(email)) problems.push('email must end with @alustudent.com');
    if(!rules.githubUrl.test(url)) problems.push('GitHub link must look like https://github.com/username');
    if (problems.length){
        console.warn('Contact check failed:', problems.join('; '));
        announce(' some contact details need fixing(About section)');    
    } else{
        console.log('contact check passed')
    }
})();

const navLinks = [...document.querySelectorAll('nav a[href^="#"]')];
const unit = (el) => el && (el.closest('section') || el);
const idOf = (a) => a.getAttribute('href').slice(1);
const pageList = [...new Set(navLinks.map((a) => unit(document.getElementById(idOf(a)))).filter(Boolean))];

function openPage(ref){
    const t = typeof ref === 'string' ? unit(document.getElementById(ref)) :unit (ref);
    if (!t) return ;
    pageList.forEach((x) => {
        x.hidden = !(x === t || x.contains(t) || t.contains(x));
    });
    for (
        let el = t;
        el && el !== document.body;
        el = el.parentElement
    ) el.hidden = false;
    navLinks.forEach((a) => {
        if (unit(document.getElementById(idOf(a))) === t) a.setAttribute('aria-current', 'page');
        else a.removeAttribute('aria-current');
    });
    window.scrollTo(0, 0);
    const h = t.querySelector('h2');
    if (h) announce(h.textContent + ' page');
}

function route() {
    const link = navLinks.find((a) => idOf(a) === location.hash.slice(1)) || navLinks[0];
    if (link) openPage(idOf(link));
}
 window.addEventListener('hashchange', route);
 route();

//--Registry: register email + GitHub (need the Apps Script URL below)
const REGISTRY_URL = 'https://script.google.com/macros/s/AKfycbzcmbBd66TqZpXg7J9Wkh-OmqwvkySjYsf_xBalecRQBa4krKuCdE9XbslOq6hKp3olkg/exec'

function regFields() {
    const email = $('reg-email').value.trim();
    const github = $('reg-github').value.trim().replace(/^https:\/\/github\.com\//i, '').replace(/\/$/, '');
    const eErr = rules.email.test(email) ? '' : 'Use your @alustudent.com email.';
    const gErr = rules.githubUser.test(github) ? '' : 'Enter a GitHub username, like my-name.';
    $('reg-email-error').textContent = eErr;
    $('reg-github-error').textContent = gErr;
    return { email, github, ok: !eErr && !gErr };
}

$('reg-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const st = $('reg-status');
    st.style.color = '';
    const { email, github, ok } = regFields();
    if (!ok) { st.textContent = 'Please fix the fields above.'; announce('Registration has errors.'); return; }
    if (!$('reg-consent').checked) { st.textContent = 'Please tick the consent box first.'; announce('Consent is needed.'); return; }
    if (!REGISTRY_URL) { st.textContent = 'The registry is not set up yet (REGISTRY_URL is empty).'; return; }
    st.textContent = 'Sending...';
    try {
        await fetch(REGISTRY_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({ email, github, consent: true, transactions: state.records })
        });
        st.style.color = '#4ade80';
        st.textContent = 'Registered. Thank you!';
        announce('Registered.');
    } catch {
        st.textContent = 'Could not reach the registry. Check your connection and try again.';
    }
});

$('reg-email-btn').addEventListener('click', () => {
    const email = $('reg-email').value.trim();
    const st = $('reg-status');
    st.style.color = '';
    if (!rules.email.test(email)) { $('reg-email-error').textContent = 'Use your @alustudent.com email.'; return; }
    $('reg-email-error').textContent = '';
    const lines = [...state.records]
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 20)
        .map((r) => `${r.date} | ${r.description} | ${r.amount.toFixed(2)} | ${r.category}`);
    const body = `My transactions (latest ${lines.length} of ${state.records.length}):\n\n` + lines.join('\n');
    window.location.href = 'mailto:' + email + '?subject=' + encodeURIComponent('My transactions') + '&body=' + encodeURIComponent(body);
});

if (!hasData()) {
        try { setRecords(await (await fetch('seed.json')).json()); } catch { /* start empty */ }
    }
    renderCategories();
    renderSettings();
    refresh();
