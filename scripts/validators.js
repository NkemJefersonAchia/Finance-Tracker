const RULES = {
  description: /^\S(?:.*\S)?$/,
  amount: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
  date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
  category: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/,
  duplicateWords: /\b(\w+)\s+\1\b/i,
};

export function validateField(field, value) {
  const trimmed = value.trim();
  if (!trimmed) return "This field is required";

  if (field === "description") {
    if (!RULES.description.test(trimmed))
      return "Description cannot have leading/trailing spaces";
    if (RULES.duplicateWords.test(trimmed))
      return "Description contains duplicate words";
  }
  if (field === "amount" && !RULES.amount.test(trimmed))
    return "Amount must be a valid format (e.g., 10.50)";
  if (field === "date" && !RULES.date.test(trimmed))
    return "Date must be in YYYY-MM-DD format";
  if (field === "category" && !RULES.category.test(trimmed))
    return "Category has invalid characters";

  return "";
}
