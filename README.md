# FAPSHI - Student Finance Tracker

A lightweight, accessible, and responsive web application for tracking personal finances, built with vanilla HTML, CSS, and JavaScript. This project fulfills the requirements of the "Building Responsive UI" summative assignment.

**Live Demo:** [Link to your GitHub Pages URL]

## Features

* **Dashboard**: At-a-glance overview of total spending, transaction count, top category, and 7-day trends.
* **Transaction Management**: Add, edit, and delete expense records.
* **Modular Code**: Clean, separated logic for state, UI, storage, and validation using ES Modules.
* **Persistence**: All data is automatically saved to the browser's `localStorage`.
* **Data Portability**: Import and export transactions via JSON and CSV formats with validation.
* **Advanced Search**: Live regex-powered search to filter transactions with error handling and match highlighting.
* **Settings**: Customize categories, set a monthly budget cap, and manage currency display (USD, EUR, GBP) with manual rates.
* **Accessibility (a11y)**: Fully keyboard-navigable, semantic HTML, ARIA live regions for announcements, and high-contrast UI.
* **Responsive Design**: Mobile-first layout that adapts from small phones to large desktops.
* **Dark/Light Theme**: Toggle between themes, with the preference saved locally.
* **Offline First**: A service worker caches the application shell for offline access.

## Regex Catalog

The application uses several regular expressions for form validation and search:

1.  **Description**: `^\S(?:.*\S)?$`
    * *Purpose*: Ensures the description has no leading or trailing whitespace.
    * *Example*: Matches `Lunch`, rejects ` Lunch `.

2.  **Amount**: `^(0|[1-9]\d*)(\.\d{1,2})?$`
    * *Purpose*: Validates positive currency values, disallowing leading zeros.
    * *Example*: Matches `12.50`, `100`, `0.99`. Rejects `012`, `12.`.

3.  **Date**: `^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$`
    * *Purpose*: Enforces `YYYY-MM-DD` date format.
    * *Example*: Matches `2025-10-25`.

4.  **Category**: `^[A-Za-z]+(?:[ -][A-Za-z]+)*$`
    * *Purpose*: Allows multi-word categories with letters, spaces, and hyphens.
    * *Example*: Matches `Student-Fees`.

5.  **Advanced: Duplicate Words**: `\b(\w+)\s+\1\b`
    * *Purpose*: (Advanced Back-reference) Catches accidentally repeated words in descriptions.
    * *Example*: Finds the second "the" in "bus to the the library".

## Keyboard Navigation Map

-   `Tab`: Move focus to the next interactive element.
-   `Shift + Tab`: Move focus to the previous interactive element.
-   `Enter`: Activate buttons, links, and sort table headers.
-   `Space`: Toggle checkboxes.
-   `Escape`: Close the delete confirmation modal.

## Accessibility Notes

-   **Landmarks**: The UI is structured with `<header>`, `<nav>`, `<main>`, and `<footer>` for easy navigation with screen readers.
-   **Focus Management**: All interactive elements have a clear `:focus-visible` style. Modals trap focus to prevent navigation outside of them.
-   **Live Regions**: Status updates (e.g., "Transaction saved") and critical alerts (e.g., "Budget exceeded") are announced to screen readers using ARIA live regions.
-   **Semantic Forms**: All form inputs are associated with a `<label>`, ensuring clarity and usability.