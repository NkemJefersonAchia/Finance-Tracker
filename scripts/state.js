export const state = {
    transactions: [],
    settings: {
        currency: 'USD',
        rates: { 
            USD: 1,
            EUR: 0.95,
            GBP: 0.82,
            RWF: 1310,
            XAF: 615,
            KES: 148,
            NGN: 800
        },
        spendingCap: 1000, // Always stored in USD
        categories: ['Food', 'Books', 'Transport', 'Entertainment', 'Fees', 'Other'],
        theme: 'light' // Default theme
    },
    editingId: null,
    sortBy: 'date',
    sortAsc: false
};

export function addTransaction(data) {
    const transaction = {
        id: Date.now().toString(),
        ...data,
        amount: parseFloat(data.amount),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    state.transactions.push(transaction);
}

export function updateTransaction(id, data) {
    const index = state.transactions.findIndex(t => t.id === id);
    if (index !== -1) {
        state.transactions[index] = {
            ...state.transactions[index],
            ...data,
            amount: parseFloat(data.amount),
            updatedAt: new Date().toISOString()
        };
    }
}

export function deleteTransaction(id) {
    state.transactions = state.transactions.filter(t => t.id !== id);
}

export function sortTransactions() {
    state.transactions.sort((a, b) => {
        let aVal = a[state.sortBy];
        let bVal = b[state.sortBy];
        if (state.sortBy === 'amount') {
            aVal = parseFloat(aVal);
            bVal = parseFloat(bVal);
        }
        if (aVal < bVal) return state.sortAsc ? -1 : 1;
        if (aVal > bVal) return state.sortAsc ? 1 : -1;
        return 0;
    });
}