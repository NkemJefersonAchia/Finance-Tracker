import { state, addTransaction, updateTransaction, deleteTransaction, sortTransactions } from './state.js';
import { validateField } from './validators.js';
import { saveState, loadState, exportToJson, exportToCsv, importFromJson } from './storage.js';
import { performSearch } from './search.js';
import { renderDashboard, renderRecords, renderSettings, renderSearchResults, showSection, announce, showModal, hideModal } from './ui.js';

// --- DOM Elements ---
const form = document.getElementById('transaction-form');
const nav = document.querySelector('nav ul');
let deleteTargetId = null;

// --- Main Application Flow ---

/**
 * Saves the current state to localStorage and re-renders all UI components.
 */
function saveAndRender() {
    saveState();
    sortTransactions();
    renderDashboard();
    renderRecords();
    renderSettings();
}

/**
 * Initializes the application, loads data, and sets up all event listeners.
 */
function init() {
    loadState();

    // --- Event Listeners Setup ---

    // Main Navigation
    nav.addEventListener('click', (e) => {
        if (e.target.matches('.nav-btn')) {
            showSection(e.target.dataset.section);
        }
    });

    // Transaction Form Submission (Add/Update)
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const fields = ['description', 'amount', 'date'];
        let hasError = false;
        const data = {};

        fields.forEach(id => {
            const input = document.getElementById(id);
            const errorDiv = document.getElementById(`${id}-error`);
            const error = validateField(id, input.value);
            if (error) {
                errorDiv.textContent = error;
                errorDiv.classList.add('show');
                hasError = true;
            } else {
                errorDiv.classList.remove('show');
                data[id] = input.value.trim();
            }
        });

        const category = document.getElementById('category').value;
        if (!category) {
            alert('Please select a category.');
            hasError = true;
        }
        data.category = category;

        if (hasError) return;

        if (state.editingId) {
            updateTransaction(state.editingId, data);
            announce('status', `Transaction updated.`);
        } else {
            addTransaction(data);
            announce('status', `Transaction added.`);
        }
        
        state.editingId = null;
        form.reset();
        document.querySelector('#transaction-form button[type="submit"]').textContent = 'Add Transaction';
        document.getElementById('cancel-edit').style.display = 'none';
        document.getElementById('date').valueAsDate = new Date();

        saveAndRender();
        showSection('records');
    });

    // Edit and Delete buttons on records (using event delegation)
    const recordsSection = document.getElementById('records');
    recordsSection.addEventListener('click', (e) => {
        const record = e.target.closest('[data-id]');
        if (!record) return;

        const id = record.dataset.id;
        if (e.target.matches('.edit-btn')) {
            const tx = state.transactions.find(t => t.id === id);
            if (tx) {
                state.editingId = id;
                form.elements.description.value = tx.description;
                form.elements.amount.value = tx.amount;
                form.elements.category.value = tx.category;
                form.elements.date.value = tx.date;
                form.querySelector('button[type="submit"]').textContent = 'Update Transaction';
                document.getElementById('cancel-edit').style.display = 'inline-block';
                showSection('add');
                form.elements.description.focus();
            }
        } else if (e.target.matches('.delete-btn')) {
            deleteTargetId = id;
            showModal('delete-modal');
            document.getElementById('confirm-delete').focus();
        }
    });

    // Cancel Edit Button
    document.getElementById('cancel-edit').addEventListener('click', () => {
        state.editingId = null;
        form.reset();
        form.querySelector('button[type="submit"]').textContent = 'Add Transaction';
        document.getElementById('cancel-edit').style.display = 'none';
        document.getElementById('date').valueAsDate = new Date();
    });

    // Delete Modal Confirmation
    document.getElementById('confirm-delete').addEventListener('click', () => {
        if (deleteTargetId) {
            deleteTransaction(deleteTargetId);
            saveAndRender();
            announce('status', 'Transaction deleted.');
        }
        hideModal('delete-modal');
        deleteTargetId = null;
    });

    document.getElementById('cancel-delete').addEventListener('click', () => hideModal('delete-modal'));

    // Live Search
    document.getElementById('search-pattern').addEventListener('input', () => {
        const pattern = document.getElementById('search-pattern').value;
        const isCaseInsensitive = document.getElementById('case-insensitive').checked;
        const { results, error } = performSearch(state.transactions, pattern, isCaseInsensitive);
        renderSearchResults(results, error);
    });
    
    // --- Settings Listeners ---
    
    // **NEW** Live Currency Update Listener
    document.getElementById('currency-select').addEventListener('input', (e) => {
        state.settings.currency = e.target.value;
        // Re-render the dashboard and records to show the live change
        renderDashboard();
        renderRecords();
    });

    // Theme Toggle
    document.getElementById('theme-toggle-btn').addEventListener('click', () => {
        state.settings.theme = state.settings.theme === 'light' ? 'dark' : 'light';
        saveAndRender();
        announce('status', `Theme changed to ${state.settings.theme} mode.`);
    });
    
    // Save All Settings Button
    document.getElementById('save-settings-btn').addEventListener('click', () => {
        state.settings.currency = document.getElementById('currency-select').value;
        state.settings.spendingCap = parseFloat(document.getElementById('spending-cap').value) || 0;
        
        // Update all currency rates from their input fields
        for (const key in state.settings.rates) {
            if (key === 'USD') continue; // USD is always 1
            const input = document.getElementById(`rate-${key.toLowerCase()}`);
            if (input) {
                state.settings.rates[key] = parseFloat(input.value) || 1;
            }
        }
        
        saveAndRender();
        announce('status', 'Settings saved.');
    });

    // Add New Category
    document.getElementById('add-category-btn').addEventListener('click', () => {
        const input = document.getElementById('new-category');
        const error = validateField('category', input.value);
        const errorDiv = document.getElementById('category-error');
        if (error) {
            errorDiv.textContent = error;
            errorDiv.classList.add('show');
            return;
        }
        state.settings.categories.push(input.value.trim());
        input.value = '';
        saveAndRender();
    });
    
    // Remove Category (using event delegation)
    document.getElementById('settings').addEventListener('click', e => {
        if(e.target.matches('.remove-category-btn')) {
            const category = e.target.dataset.category;
            if (state.settings.categories.length <= 1) {
                alert('You must have at least one category.');
                return;
            }
            state.settings.categories = state.settings.categories.filter(c => c !== category);
            saveAndRender();
        }
    });
    
    // Data Import/Export Buttons
    document.getElementById('export-json-btn').addEventListener('click', exportToJson);
    document.getElementById('export-csv-btn').addEventListener('click', exportToCsv);
    document.getElementById('import-btn').addEventListener('click', () => document.getElementById('import-file').click());
    document.getElementById('import-file').addEventListener('change', async (e) => {
        if (!e.target.files.length) return;
        try {
            const count = await importFromJson(e.target.files[0]);
            saveAndRender();
            announce('status', `${count} transactions imported.`);
        } catch (err) {
            alert(`Import failed: ${err.message}`);
        }
        e.target.value = ''; // Reset file input
    });
    
    // --- Initial Application Load ---
    saveAndRender();
    document.getElementById('date').valueAsDate = new Date();
}

// Start the app when the DOM is ready
document.addEventListener('DOMContentLoaded', init);