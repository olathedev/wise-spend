/**
 * Parse a short title from the AI receipt analysis (merchant + amount).
 * Used for expense records when we don't ask the AI for a separate title line.
 */
export function parseReceiptTitleFromAnalysis(analysis: string): string {
  let merchant: string | null = null;
  let amount: string | null = null;

  // * **Merchant:** Green Supermarket. or **Merchant:** ...
  const merchantMatch = analysis.match(
    /\*\*Merchant:\*\*\s*([^\n*]+?)(?:\.|\*|$)/i
  );
  if (merchantMatch) {
    merchant = merchantMatch[1].trim();
  }

  // **Total Amount Spent:** A cool $27.35. or similar (capture $ amount)
  const amountMatch = analysis.match(
    /\*\*Total Amount Spent:\*\*\s*[^$]*?(\$[\d,.]+)/i
  );
  if (amountMatch) {
    amount = amountMatch[1].trim();
  }

  if (merchant && amount) return `${merchant} - ${amount}`;
  if (merchant) return merchant;
  if (amount) return `Receipt - ${amount}`;
  return "Receipt";
}
