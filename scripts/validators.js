export const rules = {
    description: /^\S(?:.*\S)?$/,
    amount: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
    date:/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
    category:/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/,
    duplicateWord: /\b(\w+)\s+\1\b/i,
    email: /^[A-Za-z0-9._%+-]+@alustudent\.com$/i,
    githubUser: /^[A-Za-z0-9](?:[A-Za-z0-9]|-(?=[A-Za-z0-9])){0,38}$/,
    githubUrl: /^https:\/\/github\.com\/[A-Za-z0-9](?:[A-Za-z0-9]|-(?=[A-Za-z0-9])){0,38}(?:\/[\w.-]+)?\/?$/,
    
};

export const normalize =(s) => String(s ?? '').trim().replace(/\s{2,}/g, ' ');
export function isRealDate(s){
    if(!rules.date.test(s)) return false;
    const [y, m, d] = s.split('-').map(Number);
    const dt = new Date(Date.UTC(y, m-1, d));
    return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}

export function validateRecord(raw){
    const errors ={};
    const description =normalize(raw.description);
    const amount =String(raw.amount ?? '').trim();
    const category = normalize(raw.category);
    const date = String(raw.date ?? '').trim();

    if(!rules.description.test(description)) errors.description ='Enter a description';
    else if (rules.duplicateWord.test(description)) errors.description ='Repeated word found (e.g. "the the"). Remove it';
    if(!rules.amount.test(amount)) errors.amount = 'Use a number like 12 or 12.50 (max 2 decimals, no zeros)';
    if(!rules.category.test(category)) errors.category ='Use letters, spaces or hyphens only';
    if(!isRealDate(date)) errors.date = 'Use a real date in the format YYY-MM-DD';

    return {
        ok: Object.keys(errors).length === 0,
        errors,
        value: {description, amount: Number(amount), category, date},
    };
}

export function validateImport(data){
    if(!Array.isArray(data)) return 'File must contain a JSON array';
    const ids = new Set();
    for (const [i, r] of data.entries()){
        const at = `Record ${i + 1}: `;
        if(!r || typeof r !== 'object') return at + 'not an object.';
        if (typeof r.id !== 'string' || !r.id) return at + 'missing id';
        if (ids.has(r.id)) return at + 'duplicate id.';
        ids.add(r.id);
        if(!rules.description.test(r.description ?? '')) return at + 'invalid description';
        if (typeof r.amount !== 'number' || !rules.amount.test(String(r.amount))) return at + 'invalid amount.';
        if(!rules.category.test(r.category ?? '')) return at + 'invalid category.';
        if(!rules.date.test(r.date ?? '')) return at + 'invalid date';
        if(!r.createdAt || !r.updatedAt) return at + 'missing timestamps';
    }
    return null;
}
