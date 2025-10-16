import { state } from "./state.js";
import { escapeHtml } from "./utils.js";

function formatCurrency(amountInUsd) {
  const { currency, rates } = state.settings;
  const rate = rates[currency] || 1;
  const displayAmount = amountInUsd * rate;

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(displayAmount);
  } catch (e) {
    return `${currency} ${displayAmount.toFixed(2)}`;
  }
}

export function renderDashboard() {
  const total = state.transactions.reduce((s, t) => s + t.amount, 0);
 
  
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const weekTotal = state.transactions
    .filter((t) => new Date(t.date) >= sevenDaysAgo)
    .reduce((s, t) => s + t.amount, 0);

  const categoryTotals = state.transactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});
  const topCategory = Object.keys(categoryTotals).length
    ? Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0][0]
    : "-";

  document.getElementById("stat-count").textContent = state.transactions.length;
  document.getElementById("stat-total").textContent = formatCurrency(total);
  document.getElementById("stat-top-category").textContent = topCategory;
  document.getElementById("stat-week").textContent = formatCurrency(weekTotal);

  renderBudgetStatus(total);
  renderRecentTransactions();
}

function renderBudgetStatus(totalSpent) {
  const { spendingCap } = state.settings;
  const remaining = spendingCap - totalSpent;
  const percentage = spendingCap > 0 ? (totalSpent / spendingCap) * 100 : 0;
  const budgetDiv = document.getElementById("budget-status");
  let alertClass, message, alertMessage, statusMessage;

  if (percentage >= 100) {
    alertClass = "danger";
    message = `<strong> Budget Exceeded!</strong> You've spent ${formatCurrency(
      totalSpent
    )} of your ${formatCurrency(spendingCap)} budget.`;
    alertMessage = `Budget exceeded by ${formatCurrency(Math.abs(remaining))}.`;
  } else if (percentage >= 80) {
    alertClass = "warning";
    message = `<strong>⚡ Approaching Limit!</strong> ${formatCurrency(
      remaining
    )} remaining.`;
    statusMessage = `Approaching budget limit. ${formatCurrency(
      remaining
    )} remaining.`;
  } else {
    alertClass = "success";
    message = `<strong> On Track.</strong> ${formatCurrency(
      remaining
    )} remaining.`;
  }
  budgetDiv.innerHTML = `<div class="budget-alert ${alertClass}">${message}</div>`;
  if (alertMessage) announce("alert", alertMessage);
  if (statusMessage) announce("status", statusMessage);
}

function renderRecentTransactions() {
  const recent = [...state.transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);
  const container = document.getElementById("recent-transactions");
  if (recent.length === 0) {
    container.innerHTML = `<div class="empty-state"><p>No recent transactions.</p></div>`;
    return;
  }
  container.innerHTML = `<table><thead><tr><th>Date</th><th>Description</th><th>Amount</th></tr></thead><tbody>
        ${recent
          .map(
            (t) =>
              `<tr><td>${t.date}</td><td>${escapeHtml(
                t.description
              )}</td><td>${formatCurrency(t.amount)}</td></tr>`
          )
          .join("")}
    </tbody></table>`;
}

export function renderRecords() {
  const tbody = document.querySelector("#transactions-table tbody");
  const cardsDiv = document.getElementById("transaction-cards");
  if (state.transactions.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No transactions</td></tr>`;
    cardsDiv.innerHTML = `<div class="empty-state"><p>No transactions yet.</p></div>`;
    return;
  }
  tbody.innerHTML = state.transactions
    .map(
      (t) => `
        <tr data-id="${t.id}">
            <td>${t.date}</td><td>${escapeHtml(
        t.description
      )}</td><td>${escapeHtml(t.category)}</td><td>${formatCurrency(
        t.amount
      )}</td>
            <td class="actions"><button class="edit-btn">Edit</button><button class="delete-btn danger">Delete</button></td>
        </tr>`
    )
    .join("");
  cardsDiv.innerHTML = state.transactions
    .map(
      (t) => `
        <div class="transaction-card" data-id="${t.id}">
            <div class="transaction-card-header"><div class="transaction-card-title">${escapeHtml(
              t.description
            )}</div><div class="transaction-card-amount">${formatCurrency(
        t.amount
      )}</div></div>
            <div class="transaction-card-details">${t.date} • ${escapeHtml(
        t.category
      )}</div>
            <div class="actions"><button class="edit-btn">Edit</button><button class="delete-btn danger">Delete</button></div>
        </div>`
    )
    .join("");
}

export function renderSettings() {
  const { currency, rates, spendingCap, categories, theme } = state.settings;

  // Apply the current theme
  document.body.classList.toggle("dark-mode", theme === "dark");

  // Populate all settings inputs from the state
  document.getElementById("currency-select").value = currency;
  document.getElementById("spending-cap").value = spendingCap;

  // This loop will now automatically populate ALL rate inputs
  for (const currencyCode in rates) {
    // Skips USD as it has no rate input
    if (currencyCode === "USD") continue;

    const inputElement = document.getElementById(
      `rate-${currencyCode.toLowerCase()}`
    );
    if (inputElement) {
      inputElement.value = rates[currencyCode];
    }
  }

  // Render the list of manageable categories
  const categoriesList = document.getElementById("categories-list");
  categoriesList.innerHTML = categories
    .map(
      (cat) => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:0.5rem; border:1px solid var(--border); border-radius:4px; margin-bottom:0.5rem;">
            <span>${escapeHtml(cat)}</span>
            <button class="remove-category-btn danger" data-category="${escapeHtml(
              cat
            )}">Remove</button>
        </div>
    `
    )
    .join("");

  // Update the category dropdown in the "Add Transaction" form
  const categorySelect = document.getElementById("category");
  categorySelect.innerHTML =
    '<option value="">Select a category</option>' +
    categories
      .map(
        (cat) =>
          `<option value="${escapeHtml(cat)}">${escapeHtml(cat)}</option>`
      )
      .join("");
}

export function renderSearchResults(results, error) {
  const resultsDiv = document.getElementById("search-results");
  const errorDiv = document.getElementById("search-error");
  errorDiv.classList.remove("show");

  if (error) {
    errorDiv.textContent = error;
    errorDiv.classList.add("show");
    resultsDiv.innerHTML = "";
    return;
  }
  if (results.length === 0) {
    resultsDiv.innerHTML =
      '<div class="empty-state"><p>No matches found.</p></div>';
    return;
  }
  resultsDiv.innerHTML = `<p><strong>${
    results.length
  }</strong> match(es) found</p><table><thead><tr><th>Date</th><th>Description</th><th>Amount</th></tr></thead><tbody>
        ${results
          .map(
            (t) =>
              `<tr><td>${t.date}</td><td>${
                t.highlightedDesc
              }</td><td>${formatCurrency(t.amount)}</td></tr>`
          )
          .join("")}
    </tbody></table>`;
}

export function showSection(sectionId) {
  document
    .querySelectorAll("main section")
    .forEach((s) => s.classList.remove("active"));
  document
    .querySelectorAll("nav .nav-btn")
    .forEach((b) => b.classList.remove("active"));
  document.getElementById(sectionId).classList.add("active");
  document
    .querySelector(`nav [data-section="${sectionId}"]`)
    .classList.add("active");
}

export function announce(type, message) {
  document.getElementById(`${type}-message`).textContent = message;
}

export function showModal(id) {
  document.getElementById(id).classList.add("show");
}
export function hideModal(id) {
  document.getElementById(id).classList.remove("show");
}
