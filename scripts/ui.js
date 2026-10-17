import {state} from './state.js';
import{highlight, esc} from './search.js';
const $ =(id) => document.getElementById(id);

export function announce(msg){
    const s =$('status');
    s.textContent ='';
    setTimeout(() => {s.textContent = msg;}, 50);

}

export function money(n){
    const {rates, display} =state.settings;
    return(n * (rates[display] ?? 1)).toFixed(2) + ' ' + display;
}

export const rowText = (r) => `${r.date} ${r.description} ${money(r.amount)} ${r.category}`;

export function renderTable(rows, re){
    const tb = $('rows');
    if(!rows.length){
        tb.innerHTML = '<tr><td colspan="5"> No transactions found.</td></tr>';
        return;
    }
    tb.innerHTML = rows.map((r) => `
    <tr>
        <td data-label="Date">${highlight(r.date, re)}</td>
        <td data-label="Description">${highlight(r.description, re)}</td>
        <td data-label="Amount">${highlight(money(r.amount), re)}</td>
        <td data-label="Category">${highlight(r.category, re)}</td>
        <td data-label="Actions"> 
            <button type="button" class="secondary" data-action="edit" data-id="${esc(r.id)}" aria-label="Edit ${esc(r.description)}">Edit</button>
            <button type="button" class="danger" data-action="delete" data-id="${esc(r.id)}" aria-label="Delete ${esc(r.description)}">Delete</button>
        </td>
        </tr>`).join('');
}
const localISO = (d) => d.toLocaleDateString('en-CA');

export function renderStats(){
    const {records, settings}= state;
    const total = records.reduce((s, r) => s + r.amount, 0);
    $('stat-count').textContent= records.length;
    $('stat-sum').textContent = money(total);

    const counts={};
    records.forEach((r) => { counts[r.category] = (counts[r.category] || 0) + 1;});
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1]) [0];
    $('stat-top').textContent = top ? `${top[0]} (${top[1]})` : '–';


    const msg = $('cap-message');
    if (settings.cap > 0){
        const diff = settings.cap - total;
        const over = diff < 0;
        msg.setAttribute('aria-live', over ? 'assertive' : 'polite');
        msg.className= 'cap' + (over ? 'over' : 'ok');
        msg.textContent = over
            ? `Over budget by ${money(-diff)}.`
            :`${money(diff)} remaining of your ${money(settings.cap)} cap.`;
    } else{
        msg.className ='cap';
        msg.textContent ='No spending cap set.';

    }

    const days = [...Array(7)].map((_, i) =>{
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return localISO(d);
    });
    const sums = days.map((d) => records.filter((r) => r.date === d).reduce((s, r) => s + r.amount, 0));
    const max = Math.max(...sums, 1);
    $('trend').innerHTML =days.map((d, i) => 
        `<div class="bar"><span class="fill" style="height:${(sums[i] /max) * 100}%"></span><span class="lbl">${d.slice(5)}</span></div>`
).join('');
$('trend').setAttribute('aria-label',
    'Spending in the last 7 days: ' + days.map((d, i) => `${d} ${money(sums[i])}`).join(', '));
}

export function renderCategories(){
    $('category-list').innerHTML = state.settings.categories.map((c) => `<option value="${esc(c)}">`).join('');

}

export function renderSettings(){
    const s= state.settings;
    $('cap').value = s.cap;
    $('rate-EUR').value = s.rates.EUR;
    $('rate-RWF').value = s.rates.RWF;
    $('display').value = s.display;
    $('categories').value = s.categories.join(', ');
}

export function showErrors(errors){
    for (const f of ['description', 'amount', 'category', 'date']){
        $(f + '-error').textContent = errors[f] || '';
        $(f).setAttribute('aria-invalid', errors[f] ? 'true' : 'false');
    }
}

export function fillForm(r){
    $('rec-id').value =r.id;
    $('description').value= r.description;
    $('amount').value = r.amount;
    $('category').value=r.category;
    $('date').value= r.date;
    $('save-btn').textContent = 'Save changes';
    $('cancel-btn').hidden = false;
    showErrors({});
    $('description').focus();
}

export function clearForm(){
    $('record-form').reset();
    $('rec-id').value = '';
    $('save-btn').textContent = 'Add transaction';
    $('cancel-btn').hidden =true;
    showErrors({});

}