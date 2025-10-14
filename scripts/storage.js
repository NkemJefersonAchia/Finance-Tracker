import { state } from './state.js';

const TRANSACTION_KEY = 'financeapp:transactions';
const SETTINGS_KEY = 'financeapp:settings';

export function saveState() {
    localStorage.setItem(TRANSACTION_KEY, JSON.stringify(state.transactions));
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings));
}

export function loadState() {
    try {
        const transactions = localStorage.getItem(TRANSACTION_KEY);
        const settings = localStorage.getItem(SETTINGS_KEY);
        if (transactions) state.transactions = JSON.parse(transactions);
        if (settings) state.settings = { ...state.settings, ...JSON.parse(settings) };
    } catch (e) {
        console.error('Failed to load state from localStorage:', e);
    }
}

export function exportToJson() {
    const dataStr = JSON.stringify(state.transactions, null, 2);
    triggerDownload(dataStr, 'transactions.json', 'application/json');
}

export function exportToCsv() {
    if (state.transactions.length === 0) return;
    const headers = ['id', 'date', 'description', 'category', 'amount'];
    const csvRows = [headers.join(',')];
    state.transactions.forEach(t => {
        const row = headers.map(header => `"${String(t[header]).replace(/"/g, '""')}"`).join(',');
        csvRows.push(row);
    });
    triggerDownload(csvRows.join('\n'), 'transactions.csv', 'text/csv');
}

function triggerDownload(content, fileName, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
}

export function importFromJson(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (!Array.isArray(data) || !data.every(item => 'id' in item && 'amount' in item)) {
                    throw new Error('Invalid JSON file structure.');
                }
                state.transactions = data;
                resolve(data.length);
            } catch (err) {
                reject(err);
            }
        };
        reader.onerror = () => reject(new Error('Failed to read file.'));
        reader.readAsText(file);
    });
}