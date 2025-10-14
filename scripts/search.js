function compileRegex(pattern, isCaseInsensitive) {
    try {
        let cleanPattern = pattern.trim();
        let flags = isCaseInsensitive ? 'gi' : 'g';
        if (cleanPattern.startsWith('/')) {
            const lastSlash = cleanPattern.lastIndexOf('/');
            if (lastSlash > 0) {
                const parsedFlags = cleanPattern.substring(lastSlash + 1);
                cleanPattern = cleanPattern.substring(1, lastSlash);
                flags = parsedFlags;
            }
        }
        return new RegExp(cleanPattern, flags);
    } catch (e) {
        throw new Error('Invalid Regex Pattern');
    }
}

function highlightMatches(text, regex) {
    if (!text) return '';
    // Create a new regex from the source and flags to avoid state issues with global regex
    const localRegex = new RegExp(regex.source, regex.flags);
    return text.replace(localRegex, match => `<mark>${match}</mark>`);
}

export function performSearch(transactions, pattern, isCaseInsensitive) {
    if (!pattern.trim()) {
        return { results: [], error: null };
    }
    try {
        const regex = compileRegex(pattern, isCaseInsensitive);
        const results = transactions.filter(t => 
            regex.test(t.description) || regex.test(t.category) || regex.test(t.amount.toString())
        ).map(t => ({
            ...t,
            highlightedDesc: highlightMatches(t.description, regex),
            highlightedCat: highlightMatches(t.category, regex)
        }));
        return { results, error: null };
    } catch (e) {
        return { results: [], error: e.message };
    }
}