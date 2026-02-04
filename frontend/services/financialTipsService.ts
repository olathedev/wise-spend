import apiClient from "./axios";

export interface FinancialTip {
  id: string;
  title: string;
  content: string;
}

export interface GenerateFinancialTipsRequest {
  topic: string;
  category?: string;
}

export interface GenerateFinancialTipsResponse {
  tips: FinancialTip[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: { message: string };
}

export async function generateFinancialTips(
  topic: string,
  category?: string
): Promise<FinancialTip[]> {
  try {
    const response = await apiClient.post<
      ApiResponse<GenerateFinancialTipsResponse>
    >("/ai/financial-tips", {
      topic,
      category,
    });

    if (!response.data.success || !response.data.data) {
      throw new Error(
        response.data.error?.message || "Failed to generate financial tips"
      );
    }

    return response.data.data.tips;
  } catch (error) {
    console.error("Error generating financial tips:", error);
    // Return mock tips as fallback
    return getMockTips(topic, category);
  }
}

function getMockTips(topic: string, category?: string): FinancialTip[] {
  // Mock tips based on topic
  const mockTipsMap: Record<string, FinancialTip[]> = {
    "The 50/30/20 Rule": [
      {
        id: "1",
        title: "Understanding the 50/30/20 Rule",
        content: `The **50/30/20 rule** is a simple budgeting framework that divides your after-tax income into three categories:

- **50% for Needs**: Essential expenses like housing, utilities, groceries, transportation, and minimum debt payments
- **30% for Wants**: Non-essential spending like dining out, entertainment, hobbies, and shopping
- **20% for Savings**: Emergency fund, retirement, investments, and debt repayment beyond minimums

This rule helps you balance living comfortably today while securing your financial future.`,
      },
      {
        id: "2",
        title: "How to Apply It",
        content: `To implement the 50/30/20 rule:

1. **Calculate your after-tax income** - Your take-home pay after taxes and deductions
2. **Track your spending** - Use apps or spreadsheets to categorize expenses
3. **Adjust gradually** - Start by identifying where you're overspending
4. **Automate savings** - Set up automatic transfers to savings accounts

Remember, this is a guideline. Adjust percentages based on your income level, location, and financial goals.`,
      },
      {
        id: "3",
        title: "Common Mistakes to Avoid",
        content: `Watch out for these pitfalls:

- **Mixing needs and wants**: That premium coffee subscription? That's a want, not a need
- **Ignoring debt**: High-interest debt should be prioritized in your savings allocation
- **Being too rigid**: Life happens. Adjust the rule to fit your circumstances
- **Not reviewing regularly**: Your income and expenses change, so should your budget

The key is consistency and regular review of your spending patterns.`,
      },
    ],
    "Compound Growth": [
      {
        id: "1",
        title: "The Power of Compound Interest",
        content: `**Compound interest** is when you earn interest on both your initial investment and the interest you've already earned. It's often called "interest on interest."

Here's why it's powerful:
- Your money grows exponentially over time
- The longer you invest, the more dramatic the growth
- Starting early gives you a huge advantage

**Example**: Investing $500/month at 7% annual return:
- After 10 years: ~$85,000
- After 20 years: ~$260,000
- After 30 years: ~$600,000

Time is your greatest asset in investing!`,
      },
      {
        id: "2",
        title: "Start Early, Start Small",
        content: `You don't need a lot to start benefiting from compound growth:

- **Start with what you have**: Even $50/month makes a difference
- **Increase gradually**: As your income grows, increase your contributions
- **Stay consistent**: Regular contributions are more important than timing the market
- **Reinvest dividends**: Let your earnings compound automatically

The best time to start investing was yesterday. The second best time is today!`,
      },
      {
        id: "3",
        title: "Maximizing Compound Growth",
        content: `To maximize your compound growth:

1. **Invest in tax-advantaged accounts** - 401(k)s, IRAs, and HSAs offer tax benefits
2. **Diversify your investments** - Spread risk across different asset classes
3. **Keep fees low** - High fees eat into your returns over time
4. **Stay invested** - Don't try to time the market; time in the market beats timing the market
5. **Increase contributions** - As you earn more, invest more

Remember: Small, consistent actions lead to significant long-term results.`,
      },
    ],
    "Emergency Fund": [
      {
        id: "1",
        title: "Why You Need an Emergency Fund",
        content: `An **emergency fund** is your financial safety net. It protects you from:

- Unexpected medical bills
- Job loss or reduced income
- Major car or home repairs
- Unplanned travel for family emergencies

Without an emergency fund, you might:
- Rack up high-interest credit card debt
- Dip into retirement savings (with penalties)
- Stress about every unexpected expense

Having this buffer gives you peace of mind and financial security.`,
      },
      {
        id: "2",
        title: "How Much to Save",
        content: `The general rule is **3-6 months of expenses**, but consider:

**3 months** if you have:
- Stable income
- Low debt
- Good job security

**6 months** if you have:
- Variable income (freelance, commission)
- High debt
- Dependents
- Uncertain job security

**Start small**: Aim for $1,000 first, then build up to your full target. Every bit helps!`,
      },
      {
        id: "3",
        title: "Where to Keep It",
        content: `Your emergency fund should be:

- **Easily accessible** - Available within 1-2 days
- **Separate from checking** - Avoid temptation to spend it
- **In a high-yield savings account** - Earn interest while it sits
- **Not invested** - Keep it safe from market volatility

**Pro tip**: Set up automatic transfers from your checking to savings account. Out of sight, out of mind, but there when you need it!`,
      },
    ],
    "Inflation vs. Cash": [
      {
        id: "1",
        title: "Understanding Inflation",
        content: `**Inflation** is the rate at which prices increase over time. When inflation is 3%, your $100 today will only buy $97 worth of goods next year.

**Why it matters**:
- Your cash loses purchasing power over time
- $1,000 today ≠ $1,000 in 10 years
- Keeping too much cash means losing money slowly

**Current impact**: With 3% annual inflation, your cash loses about 3% of its value each year. Over 10 years, $10,000 becomes worth only about $7,400 in today's dollars.`,
      },
      {
        id: "2",
        title: "The Cash Trap",
        content: `Many people keep too much cash because:

- **Fear of losing money** - But you're losing money to inflation anyway
- **Lack of knowledge** - Don't know where else to put it
- **Comfort of liquidity** - Want instant access

**The reality**: While cash feels safe, it's actually eroding in value. You need some cash for emergencies, but excess cash should be working for you through investments.`,
      },
      {
        id: "3",
        title: "Beating Inflation",
        content: `To protect your wealth from inflation:

1. **Invest in assets that grow** - Stocks, real estate, bonds
2. **Diversify your portfolio** - Don't put all eggs in one basket
3. **Keep only necessary cash** - 3-6 months expenses in savings
4. **Consider inflation-protected securities** - TIPS, I-Bonds
5. **Review regularly** - Adjust your strategy as inflation changes

**Remember**: The goal isn't to avoid all risk—it's to manage risk while growing your wealth faster than inflation erodes it.`,
      },
    ],
  };

  // Return mock tips for the topic, or generic tips if topic not found
  return (
    mockTipsMap[topic] || [
      {
        id: "1",
        title: `Learn About ${topic}`,
        content: `**${topic}** is an important financial concept worth understanding. 

This topic covers key principles that can help you make better financial decisions and build wealth over time.

Take time to research and understand how this applies to your personal financial situation.`,
      },
      {
        id: "2",
        title: "Apply What You Learn",
        content: `Knowledge without action is just information. 

Once you understand **${topic}**, think about how you can apply it to your own finances:

- What changes can you make today?
- How does this affect your financial goals?
- What's your next step?

Small actions lead to big results over time.`,
      },
    ]
  );
}
