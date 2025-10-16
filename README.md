# FAPSHI - Student Finance Tracker

A lightweight, accessible, and responsive web application for tracking personal finances, built with vanilla HTML, CSS, and JavaScript. 


**Live Demo website link:** https://nkemjefersonachia.github.io/Finance-Tracker/
---
**Demo Video Link:** https://youtu.be/7uTXWKt34Kk?feature=shared
---

## Features

- **Dashboard**: At-a-glance overview of total spending, transaction count, top category, and 7-day trends.
- **Transaction Management**: Add, edit, and delete expense records.
- **Modular Code**: Clean, separated logic for state, UI, storage, and validation using ES Modules.
- **Persistence**: All data is automatically saved to the browser's `localStorage`.
- **Data Portability**: Import and export transactions via JSON and CSV formats with validation.
- **Advanced Search**: Live regex-powered search to filter transactions with error handling and match highlighting.
- **Settings**: Customize categories, set a monthly budget cap, and manage currency display (USD, EUR, GBP) with manual rates.
- **Accessibility (a11y)**: Fully keyboard-navigable, semantic HTML, ARIA live regions for announcements, and high-contrast UI.
- **Responsive Design**: Mobile-first layout that adapts from small phones to large desktops.
- **Dark/Light Theme**: Toggle between themes, with the preference saved locally.
- **Offline First**: A service worker caches the application shell for offline access.

---

## Setup Guide

To run this project locally, follow these steps:

### **Prerequisites**
- A stable internet connection.
- A modern web browser (e.g., Chrome, Firefox, Safari).

### **Installation**
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/NkemJefersonAchia/finance-tracker.git
2.  **Navigate to the project directory:**
    ```bash
    cd finance-tracker
    ```
3.  **Open `index.html` in your browser:**
    You can simply open the file directly, or use a live server extension in your code editor for automatic reloading.

---

## Code Formatting

The codebase is formatted to ensure consistency and readability.
- **CSS**: All stylesheets were formatted using a professional **CSS code formatter**.
- **JavaScript/HTML**: The overall project structure and code style are maintained using **Prettier code formatter**.

---

## Testing Instructions

This project is built with vanilla JavaScript and does not have an automated testing suite. To test the functionality:

1.  **Manual Testing:**
    - Try adding, editing, and deleting transactions.
    - Test all form validations, including the regex patterns.
    - Import and export data using the provided JSON and CSV buttons.
    - Verify that data persists after reloading the page.
    - Test the search functionality with different regex patterns.
    - Check responsiveness by resizing your browser window.

2.  **Linting & Formatting:**
    - Code quality can be checked using tools like ESLint and Prettier.

---

## Regex Catalog

The application uses several regular expressions for form validation and search:

1.  **Description**: `^\S(?:.*\S)?$`
    - _Purpose_: Ensures the description has no leading or trailing whitespace.
    - _Example_: Matches `Lunch`, rejects ` Lunch `.

2.  **Amount**: `^(0|[1-9]\d*)(\.\d{1,2})?$`
    - _Purpose_: Validates positive currency values, disallowing leading zeros.
    - _Example_: Matches `12.50`, `100`, `0.99`. Rejects `012`, `12.`.

3.  **Date**: `^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$`
    - _Purpose_: Enforces `YYYY-MM-DD` date format.
    - _Example_: Matches `2025-10-25`.

4.  **Category**: `^[A-Za-z]+(?:[ -][A-Za-z]+)*$`
    - _Purpose_: Allows multi-word categories with letters, spaces, and hyphens.
    - _Example_: Matches `Student-Fees`.

5.  **Advanced: Duplicate Words**: `\b(\w+)\s+\1\b`
    - _Purpose_: (Advanced Back-reference) Catches accidentally repeated words in descriptions.
    - _Example_: Finds the second "the" in "bus to the the library".

---

## Keyboard Navigation Map

- `Tab`: Move focus to the next interactive element.
- `Shift + Tab`: Move focus to the previous interactive element.
- `Enter`: Activate buttons, links, and sort table headers.
---

## Accessibility Notes

- **Landmarks**: The UI is structured with `<header>`, `<nav>`, `<main>`, and `<footer>` for easy navigation with screen readers.
- **Focus Management**: All interactive elements have a clear `:focus-visible` style. Modals trap focus to prevent navigation outside of them.
- **Live Regions**: Status updates (e.g., "Transaction saved") and critical alerts (e.g., "Budget exceeded") are announced to screen readers using ARIA live regions.
- **Semantic Forms**: All form inputs are associated with a `<label>`, ensuring clarity and usability.

---

## References and Inspiration

This project was built with the help of documentation and inspiration from various sources across the web. They include:
- **MDN Web Docs**: For comprehensive documentation on HTML, CSS, and JavaScript.
- **CSS-Tricks**: For practical tips, tricks, and guides on modern CSS.
- **Dribbble & Behance**: For UI/UX design inspiration.
- **Google Fonts**: For typography.
- **W3 Schools**:  For indepth tutorials on advanced CSS and JavaScript.
- **FreeCodeCamp**: For more  indepth tutorials on advanced CSS and JavaScript.