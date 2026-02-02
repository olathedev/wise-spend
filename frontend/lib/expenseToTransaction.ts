import type { Transaction } from "@/components/types";
import type { ExpenseDto } from "@/services/receiptService";

/**
 * Parse vendor and amount from backend title (e.g. "Green Supermarket - $27.35").
 */
function parseTitle(title: string): { vendor: string; amount: number } {
  const dashIndex = title.lastIndexOf(" - ");
  if (dashIndex === -1) {
    return { vendor: title || "Receipt", amount: 0 };
  }
  const vendor = title.slice(0, dashIndex).trim() || "Receipt";
  const amountStr = title.slice(dashIndex + 3).trim();
  const match = amountStr.replace(/,/g, "").match(/\$?([\d.]+)/);
  const amount = match ? -Math.abs(parseFloat(match[1])) : 0;
  return { vendor, amount };
}

/**
 * Extract amount from expense title (returns positive number).
 */
export function parseAmountFromTitle(title: string): number {
  const dashIndex = title.lastIndexOf(" - ");
  if (dashIndex === -1) return 0;
  const amountStr = title.slice(dashIndex + 3).trim();
  const match = amountStr.replace(/,/g, "").match(/\$?([\d.]+)/);
  return match ? parseFloat(match[1]) : 0;
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
  const { vendor, amount } = parseTitle(e.title);
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
