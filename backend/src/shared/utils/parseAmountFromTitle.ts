/**
 * Extract amount from text (analysis or title).
 * Looks for patterns like "$27.35", "27.35", "Total Amount Spent: $27.35", etc.
 */
function extractAmountFromText(text: string): number {
  if (!text) return 0;

  // Pattern 1: "Total Amount Spent:** $27.35" or similar
  const totalAmountMatch = text.match(/\*\*Total Amount Spent:\*\*\s*[^$]*?(\$[\d,.]+)/i);
  if (totalAmountMatch) {
    const amount = parseFloat(totalAmountMatch[1].replace(/[$,]/g, ""));
    if (!isNaN(amount) && amount > 0) return amount;
  }

  // Pattern 2: "$27.35" or "$ 27.35" anywhere in text
  const dollarAmountMatch = text.match(/\$\s*([\d,.]+)/);
  if (dollarAmountMatch) {
    const amount = parseFloat(dollarAmountMatch[1].replace(/,/g, ""));
    if (!isNaN(amount) && amount > 0) return amount;
  }

  // Pattern 3: "27.35" (standalone number, prefer larger numbers that look like amounts)
  const numberMatches = text.match(/\b(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\b/g);
  if (numberMatches) {
    // Filter for numbers that look like currency amounts (has decimal or is reasonably sized)
    const amounts = numberMatches
      .map((m) => {
        const num = parseFloat(m.replace(/,/g, ""));
        return { num, original: m };
      })
      .filter(({ num, original }) => !isNaN(num) && num > 0 && (num >= 1 || original.includes(".")))
      .map(({ num }) => num);
    if (amounts.length > 0) {
      // Return the largest number that's likely the total (usually the largest)
      return Math.max(...amounts);
    }
  }

  return 0;
}

/**
 * Parse numeric amount from expense title (e.g. "Green Supermarket - $27.35" -> 27.35).
 * Falls back to extracting from aiDescription if not found in title.
 */
export function parseAmountFromTitle(title: string, aiDescription?: string): number {
  // First try to parse from title
  const dashIndex = title.lastIndexOf(" - ");
  if (dashIndex !== -1) {
    const amountStr = title.slice(dashIndex + 3).trim();
    const match = amountStr.replace(/,/g, "").match(/\$?([\d.]+)/);
    if (match) {
      const amount = parseFloat(match[1]);
      if (amount > 0) return amount;
    }
  }

  // Fallback to extracting from aiDescription
  if (aiDescription) {
    return extractAmountFromText(aiDescription);
  }

  return 0;
}
