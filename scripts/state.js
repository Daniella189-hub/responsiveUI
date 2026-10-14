import {load, save, loadSettings, saveSettings} from './storage.js';
export const state = {records: load(), settings: loadSettings()};
function nextId(){
    const n =state.records.reduce((m,r) => Math.max(m, parseInt(String(r.id).split('_')[1], 10) || 0), 0) + 1;
    return 'rec_' + String(n).padStart(4, '0');
}
export function addRecord(data){
    const now = new Date().toISOString();
    state.records.push({id:nextId(), ...data, createdAt:now, updatedAt:now});
    save(state.records);
}
 export function updatedRecord(id, data){
    const r =state.records.find((x) => x.id === id);
    if(!r) return;
    Object.assign(r, data, {updatedAt: new Date().toISOString() });
    save(state.records);
 }

 export function deleteRecord(id){
    state.records =state.records.filter((r) => r.id !== id);
    save(state.records);
 }

 export function setRecords(records){
    state.records = records;
    save(records);
 }

 export function updateSettings(patch){
    state.settings = { ...state.settings, ...patch };
    saveSettings(state.settings);
 }