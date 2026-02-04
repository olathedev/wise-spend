import type { Transaction } from "@/components/types";
import type { ExpenseDto } from "@/services/receiptService";

/**
 * Extract amount from text (analysis or title).
 * Looks for patterns like "$27.35", "27.35", "Total Amount Spent: $27.35", etc.
 */
function extractAmountFromText(text: string): number {
  if (!text) return 0;
  
  // Try to find amount patterns in the text
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
      .map(m => parseFloat(m.replace(/,/g, "")))
      .filter(n => !isNaN(n) && n > 0 && (n >= 1 || n.toString().includes(".")));
    if (amounts.length > 0) {
      // Return the largest number that's likely the total (usually the largest)
      return Math.max(...amounts);
    }
  }
  
  return 0;
}

/**
 * Parse vendor and amount from backend title (e.g. "Green Supermarket - $27.35").
 * Falls back to extracting amount from aiDescription if not found in title.
 */
function parseTitle(title: string, aiDescription?: string): { vendor: string; amount: number } {
  const dashIndex = title.lastIndexOf(" - ");
  let vendor = title || "Receipt";
  let amount = 0;
  
  if (dashIndex !== -1) {
    vendor = title.slice(0, dashIndex).trim() || "Receipt";
    const amountStr = title.slice(dashIndex + 3).trim();
    const match = amountStr.replace(/,/g, "").match(/\$?([\d.]+)/);
    amount = match ? parseFloat(match[1]) : 0;
  }
  
  // If amount not found in title, try extracting from aiDescription
  if (amount === 0 && aiDescription) {
    amount = extractAmountFromText(aiDescription);
  }
  
  return { vendor, amount: amount > 0 ? -Math.abs(amount) : 0 };
}

/**
 * Extract amount from expense title (returns positive number).
 * Falls back to extracting from aiDescription if provided.
 */
export function parseAmountFromTitle(title: string, aiDescription?: string): number {
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

function formatDate(isoDate: string): string {
  const d = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

export function expenseToTransaction(e: ExpenseDto): Transaction {
  const { vendor, amount } = parseTitle(e.title, e.aiDescription);
  return {
    id: e.id,
    date: formatDate(e.createdAt),
    vendor,
    icon: "receipt",
    category: "Essentials",
    status: "AI Verified",
    amount,
    imageUrl: e.imageUrl,
    receiptAnalysis: e.aiDescription,
    total: Math.abs(amount),
  };
}
