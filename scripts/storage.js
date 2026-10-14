const KEY ='sft:records';
const SKEY ='sft:settings';
 export const defaultSettings ={
    cap:200,
    display: 'USD',
    rates:{USD:1, EUR: 0.92, RWF:1300},
    categories: ['Food','Books', 'Transport', 'Entertainment', 'Fees', 'Other'],
 };

export const hasData = () => localStorage.getItem(KEY) !== null;
export function load(){
    try{
        return JSON.parse(localStorage.getItem(KEY)) ?? []; } catch {return [];}
    
    }
export const save =(records) => localStorage.setItem(KEY, JSON.stringify(records));
export function loadSettings(){
    try{ return { ...defaultSettings, ...JSON.parse(localStorage.getItem(SKEY))};}
    catch{return { ...defaultSettings};}
}
export const saveSettings = (s) => localStorage.setItem(SKEY, JSON.stringify(s));
export function exportJSON(records) {
    const blob = new Blob([JSON.stringify(records, null, 2)], {type:'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.click();
    URL.revokeObjectURL(a.href);
}



  