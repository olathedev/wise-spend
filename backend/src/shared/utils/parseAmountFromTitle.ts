/**
 * Parse numeric amount from expense title (e.g. "Green Supermarket - $27.35" -> 27.35).
 */
export function parseAmountFromTitle(title: string): number {
  const match = title.match(/\$([\d,.]+)\s*$/);
  if (!match) return 0;
  const cleaned = match[1].replace(/,/g, "");
  const num = parseFloat(cleaned);
  return Number.isFinite(num) && num >= 0 ? num : 0;
}
