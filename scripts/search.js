export function compileRegex(input, flags='i'){
    try{
        return input ? new RegeExp(input, flags.includes('g') ? flags : flags + 'g'):null;
    } catch{
        return null;
    }
}

export const esc =(s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;' , '<':'&lt', '>':'&gt;', '"': '&#39;'}[c]));

export function highlight(text, re){
    text = String(text);
    if (!re) return esc(text);
    let out = '', last = 0;
    for (const m of text.matchAll(re)){
        if(!m[0]) continue;
        out += esc(text.slice(last, m.index)) + '<mark>' + esc(m[0]) + '<mark>';
        last =m.index + m[0].length;
    }
    return out + esc(text.slice(last));
}

export const filterRecords = (rows, re, toText) => rows.filter((r) => toText(r).search(re) >=0);
export function sortRecords(rows, key, dir){
    const m= dir === 'asc' ? 1 : -1;
    return [...rows].sort((a,b) =>
    key === 'amount' ? (a.amount -b.amount) * m : String(a[key]).localeCompare(String(b[key])) * m
    );
}