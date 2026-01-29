import { QuizQuestion } from './QuizModal';

export const QUIZ_DATA: Record<number, QuizQuestion[]> = {
  1: [ // The 50/30/20 Rule
    {
      id: 1,
      question: "What percentage of income should go to Needs in the 50/30/20 rule?",
      options: ["30%", "50%", "20%", "40%"],
      correctAnswer: 1,
      explanation: "The 50/30/20 rule allocates 50% of income to Needs (essential expenses like housing, food, utilities)."
    },
    {
      id: 2,
      question: "Which category does entertainment fall under in the 50/30/20 rule?",
      options: ["Needs (50%)", "Wants (30%)", "Savings (20%)", "None of the above"],
      correctAnswer: 1,
      explanation: "Entertainment is a Want, which should be 30% of your income according to the 50/30/20 rule."
    },
    {
      id: 3,
      question: "What should the 20% portion be used for?",
      options: ["Emergency fund and debt repayment", "Only emergency fund", "Only investments", "Vacation savings"],
      correctAnswer: 0,
      explanation: "The 20% should go toward savings, emergency fund, and debt repayment - building your financial foundation."
    },
    {
      id: 4,
      question: "If you earn $5,000/month, how much should go to Savings?",
      options: ["$1,000", "$1,500", "$2,500", "$500"],
      correctAnswer: 0,
      explanation: "20% of $5,000 is $1,000, which should be allocated to savings and debt repayment."
    },
    {
      id: 5,
      question: "Which expense is considered a 'Need'?",
      options: ["Streaming subscription", "Rent or mortgage", "Dining out", "Hobbies"],
      correctAnswer: 1,
      explanation: "Rent or mortgage is a Need (essential housing expense), while the others are Wants."
    },
    {
      id: 6,
      question: "The 50/30/20 rule is best applied to:",
      options: ["Gross income", "Net income (after taxes)", "Disposable income", "Annual income"],
      correctAnswer: 1,
      explanation: "Apply the rule to your net income (take-home pay after taxes) for accurate budgeting."
    },
    {
      id: 7,
      question: "What's the main benefit of the 50/30/20 rule?",
      options: ["It's legally required", "Provides a simple framework for budgeting", "Maximizes investment returns", "Eliminates all debt"],
      correctAnswer: 1,
      explanation: "The rule provides a simple, easy-to-follow framework that balances spending and saving without being too restrictive."
    },
    {
      id: 8,
      question: "If your Needs exceed 50%, you should:",
      options: ["Ignore the rule", "Reduce Wants to compensate", "Increase income or reduce Needs", "Skip savings"],
      correctAnswer: 2,
      explanation: "If Needs exceed 50%, focus on increasing income or reducing essential expenses, rather than sacrificing savings."
    },
    {
      id: 9,
      question: "Which is NOT part of the 50/30/20 allocation?",
      options: ["Needs", "Wants", "Savings", "Investments"],
      correctAnswer: 3,
      explanation: "Investments are part of the Savings (20%) category, not a separate allocation in the rule."
    },
    {
      id: 10,
      question: "The 50/30/20 rule was popularized by:",
      options: ["Warren Buffett", "Elizabeth Warren", "Dave Ramsey", "Suze Orman"],
      correctAnswer: 1,
      explanation: "Senator Elizabeth Warren popularized this rule in her book 'All Your Worth: The Ultimate Lifetime Money Plan'."
    },
    {
      id: 11,
      question: "Can the 50/30/20 rule be adjusted?",
      options: ["No, it's fixed", "Yes, based on your financial situation", "Only for high earners", "Only for low earners"],
      correctAnswer: 1,
      explanation: "The rule is a guideline and can be adjusted based on your income level, location, and financial goals."
    },
    {
      id: 12,
      question: "What should you do first before applying the 50/30/20 rule?",
      options: ["Start investing", "Track your current spending", "Open a savings account", "Pay off all debt"],
      correctAnswer: 1,
      explanation: "First, track your current spending to understand where your money goes, then apply the rule accordingly."
    }
  ],
  2: [ // Compound Growth
    {
      id: 1,
      question: "What is compound interest?",
      options: ["Interest on principal only", "Interest on principal plus previously earned interest", "Fixed interest rate", "Simple interest calculation"],
      correctAnswer: 1,
      explanation: "Compound interest is earning interest on both your principal investment and the interest you've already earned, creating exponential growth."
    },
    {
      id: 2,
      question: "If you invest $1,000 at 7% annual return, how much will you have after 10 years (approximately)?",
      options: ["$1,700", "$2,000", "$1,967", "$1,500"],
      correctAnswer: 2,
      explanation: "With compound interest at 7% annually, $1,000 grows to approximately $1,967 in 10 years."
    },
    {
      id: 3,
      question: "What's the 'Rule of 72' used for?",
      options: ["Calculating taxes", "Estimating how long it takes to double your money", "Determining risk", "Setting budgets"],
      correctAnswer: 1,
      explanation: "The Rule of 72 estimates years to double money: divide 72 by your interest rate. At 7%, it takes about 10 years."
    },
    {
      id: 4,
      question: "Why is starting to invest early so powerful?",
      options: ["Lower risk", "More time for compound growth", "Better interest rates", "Less competition"],
      correctAnswer: 1,
      explanation: "Starting early gives your money more time to compound, dramatically increasing your final balance even with smaller contributions."
    },
    {
      id: 5,
      question: "If you invest $500/month at 7% for 10 years, approximately how much will you have?",
      options: ["$60,000", "$85,000", "$75,000", "$50,000"],
      correctAnswer: 1,
      explanation: "With monthly contributions of $500 at 7% annual return, you'll have approximately $85,000 after 10 years due to compounding."
    },
    {
      id: 6,
      question: "What happens to compound growth if you increase your investment time?",
      options: ["It decreases", "It increases exponentially", "It stays the same", "It becomes linear"],
      correctAnswer: 1,
      explanation: "Compound growth increases exponentially over time - the longer you invest, the more dramatic the growth becomes."
    },
    {
      id: 7,
      question: "Which factor has the biggest impact on compound growth?",
      options: ["Initial investment amount", "Time invested", "Interest rate", "All equal"],
      correctAnswer: 1,
      explanation: "Time has the biggest impact because compound interest grows exponentially - more time means significantly more growth."
    },
    {
      id: 8,
      question: "What is the difference between simple and compound interest?",
      options: ["No difference", "Compound earns interest on interest", "Simple is better", "Compound is only for stocks"],
      correctAnswer: 1,
      explanation: "Simple interest is calculated only on principal, while compound interest earns returns on both principal and accumulated interest."
    },
    {
      id: 9,
      question: "If you delay investing by 10 years, how much more do you need to invest monthly to catch up?",
      options: ["Same amount", "2x more", "3-4x more", "10x more"],
      correctAnswer: 2,
      explanation: "Due to compound growth, delaying 10 years typically requires investing 3-4x more monthly to reach the same final amount."
    },
    {
      id: 10,
      question: "What's a realistic long-term stock market return expectation?",
      options: ["3-4%", "5-6%", "7-10%", "15-20%"],
      correctAnswer: 2,
      explanation: "Historically, the stock market averages 7-10% annual returns over long periods (20+ years), adjusted for inflation."
    },
    {
      id: 11,
      question: "Compound growth works best with:",
      options: ["Frequent withdrawals", "Regular contributions and time", "High-risk investments only", "Short-term investments"],
      correctAnswer: 1,
      explanation: "Compound growth works best with regular contributions over a long time period, allowing interest to compound on interest."
    },
    {
      id: 12,
      question: "What percentage return would double your money in 7 years?",
      options: ["7%", "10%", "14%", "20%"],
      correctAnswer: 1,
      explanation: "Using the Rule of 72: 72 ÷ 7 years ≈ 10% annual return would double your money in about 7 years."
    }
  ],
  3: [ // Inflation vs. Cash
    {
      id: 1,
      question: "What is inflation?",
      options: ["Increase in stock prices", "General increase in prices over time", "Decrease in currency value", "Both B and C"],
      correctAnswer: 3,
      explanation: "Inflation is the general increase in prices over time, which decreases the purchasing power of your money."
    },
    {
      id: 2,
      question: "If inflation is 3% and your cash earns 0.5% interest, what's your real return?",
      options: ["3.5%", "-2.5%", "2.5%", "0.5%"],
      correctAnswer: 1,
      explanation: "Real return = interest rate - inflation = 0.5% - 3% = -2.5%. Your purchasing power decreases."
    },
    {
      id: 3,
      question: "Why is holding too much cash problematic?",
      options: ["It's illegal", "Inflation erodes purchasing power", "Banks charge fees", "It's too risky"],
      correctAnswer: 1,
      explanation: "Inflation erodes the purchasing power of cash over time - $100 today buys less than $100 a year from now if inflation is positive."
    },
    {
      id: 4,
      question: "What's a typical annual inflation rate in developed countries?",
      options: ["0-1%", "2-3%", "5-7%", "10%+"],
      correctAnswer: 1,
      explanation: "Most developed countries target 2-3% annual inflation, which is considered healthy for economic growth."
    },
    {
      id: 5,
      question: "To beat inflation, your investments should return:",
      options: ["More than 0%", "More than inflation rate", "Exactly inflation rate", "Less than inflation"],
      correctAnswer: 1,
      explanation: "To maintain and grow purchasing power, investments should return more than the inflation rate."
    },
    {
      id: 6,
      question: "What happens to $100 in cash after 10 years with 3% annual inflation?",
      options: ["Worth $100", "Worth $130", "Worth about $74", "Worth $97"],
      correctAnswer: 2,
      explanation: "With 3% inflation, $100 loses purchasing power. After 10 years, it's worth about $74 in today's dollars."
    },
    {
      id: 7,
      question: "Which is better for long-term wealth: cash or investments?",
      options: ["Cash (safer)", "Investments (beat inflation)", "Equal", "Depends on age"],
      correctAnswer: 1,
      explanation: "Investments typically beat inflation over time, while cash loses purchasing power, making investments better for long-term wealth."
    },
    {
      id: 8,
      question: "How much cash should you keep as an emergency fund?",
      options: ["All your money", "3-6 months expenses", "1 year expenses", "None"],
      correctAnswer: 1,
      explanation: "Keep 3-6 months of expenses in cash for emergencies, but invest the rest to beat inflation."
    },
    {
      id: 9,
      question: "What is 'real return'?",
      options: ["Nominal return", "Return adjusted for inflation", "Guaranteed return", "Tax-free return"],
      correctAnswer: 1,
      explanation: "Real return is your investment return minus inflation - it shows your actual purchasing power increase."
    },
    {
      id: 10,
      question: "If inflation is 3% and you earn 5% on investments, your real return is:",
      options: ["8%", "2%", "5%", "3%"],
      correctAnswer: 1,
      explanation: "Real return = 5% - 3% = 2%. This is your actual purchasing power increase after accounting for inflation."
    },
    {
      id: 11,
      question: "High inflation periods are called:",
      options: ["Deflation", "Stagflation", "Hyperinflation", "Disinflation"],
      correctAnswer: 2,
      explanation: "Hyperinflation refers to extremely high inflation rates, often 50%+ per month, which destroys cash value rapidly."
    },
    {
      id: 12,
      question: "The best strategy for cash is to:",
      options: ["Keep all in cash", "Keep emergency fund in cash, invest the rest", "Invest everything", "Spend it all"],
      correctAnswer: 1,
      explanation: "Keep 3-6 months expenses in cash for emergencies, but invest excess cash to beat inflation and grow wealth."
    }
  ],
  4: [ // Emergency Fund
    {
      id: 1,
      question: "How much should you have in an emergency fund?",
      options: ["1 month expenses", "3-6 months expenses", "1 year expenses", "2 months expenses"],
      correctAnswer: 1,
      explanation: "Financial experts recommend 3-6 months of expenses in an emergency fund to cover unexpected situations."
    },
    {
      id: 2,
      question: "Where should you keep your emergency fund?",
      options: ["Under your mattress", "High-yield savings account", "Stock market", "Cryptocurrency"],
      correctAnswer: 1,
      explanation: "Keep emergency funds in a high-yield savings account - easily accessible, FDIC insured, and earns some interest."
    },
    {
      id: 3,
      question: "What is an emergency fund for?",
      options: ["Vacations", "Unexpected expenses like job loss or medical bills", "Investments", "Shopping"],
      correctAnswer: 1,
      explanation: "Emergency funds are for true emergencies: job loss, medical emergencies, major car repairs, or unexpected large expenses."
    },
    {
      id: 4,
      question: "Should you invest your emergency fund in stocks?",
      options: ["Yes, for higher returns", "No, keep it liquid and safe", "Sometimes", "Only if you're young"],
      correctAnswer: 1,
      explanation: "No - emergency funds should be liquid and safe. Stocks can lose value when you need the money most."
    },
    {
      id: 5,
      question: "If your monthly expenses are $3,000, how much emergency fund should you aim for?",
      options: ["$3,000", "$9,000-$18,000", "$30,000", "$6,000"],
      correctAnswer: 1,
      explanation: "3-6 months of $3,000 = $9,000 to $18,000 emergency fund target."
    },
    {
      id: 6,
      question: "When should you use your emergency fund?",
      options: ["For planned expenses", "Only for true emergencies", "For investments", "For entertainment"],
      correctAnswer: 1,
      explanation: "Use emergency funds only for true emergencies - unexpected, necessary expenses that can't be covered by regular income."
    },
    {
      id: 7,
      question: "What happens if you use your emergency fund?",
      options: ["Nothing", "Rebuild it as soon as possible", "Don't worry about it", "Spend more"],
      correctAnswer: 1,
      explanation: "After using emergency funds, prioritize rebuilding it as soon as possible to maintain your financial safety net."
    },
    {
      id: 8,
      question: "Emergency fund should cover:",
      options: ["Only rent", "Essential expenses (housing, food, utilities, insurance)", "All expenses including entertainment", "Just medical bills"],
      correctAnswer: 1,
      explanation: "Emergency funds should cover essential expenses: housing, food, utilities, insurance, and minimum debt payments."
    },
    {
      id: 9,
      question: "How quickly should you be able to access your emergency fund?",
      options: ["Within 1 year", "Within 1 month", "Immediately or within days", "Doesn't matter"],
      correctAnswer: 2,
      explanation: "Emergency funds should be immediately accessible or available within days - that's why savings accounts are ideal."
    },
    {
      id: 10,
      question: "Should freelancers have a larger emergency fund?",
      options: ["No, same as everyone", "Yes, 6-12 months", "They don't need one", "Only 1 month"],
      correctAnswer: 1,
      explanation: "Freelancers and self-employed individuals should aim for 6-12 months due to irregular income."
    },
    {
      id: 11,
      question: "Emergency fund vs. savings account:",
      options: ["Same thing", "Emergency fund is separate from other savings", "Don't need both", "Only need savings"],
      correctAnswer: 1,
      explanation: "Emergency fund is separate from other savings goals (vacation, down payment). It's specifically for emergencies only."
    },
    {
      id: 12,
      question: "What's the first step to building an emergency fund?",
      options: ["Invest in stocks", "Save $1,000 first, then build to 3-6 months", "Wait for a bonus", "Borrow money"],
      correctAnswer: 1,
      explanation: "Start with a $1,000 starter emergency fund, then gradually build it to 3-6 months of expenses over time."
    }
  ],
  5: [ // Debt Snowball Method
    {
      id: 1,
      question: "What is the Debt Snowball Method?",
      options: ["Paying highest interest first", "Paying smallest balance first", "Paying all equally", "Ignoring debt"],
      correctAnswer: 1,
      explanation: "The Debt Snowball Method focuses on paying off the smallest debt first, regardless of interest rate, for psychological wins."
    },
    {
      id: 2,
      question: "Why does the snowball method work psychologically?",
      options: ["It doesn't", "Quick wins build momentum", "It's faster", "It saves more money"],
      correctAnswer: 1,
      explanation: "Paying off small debts quickly provides quick wins and builds momentum, keeping you motivated to continue."
    },
    {
      id: 3,
      question: "After paying off the smallest debt, what do you do?",
      options: ["Stop", "Roll that payment into the next smallest", "Spend it", "Save it"],
      correctAnswer: 1,
      explanation: "Take the payment you were making on the smallest debt and add it to the next smallest debt's payment."
    },
    {
      id: 4,
      question: "What's the main advantage of the snowball method?",
      options: ["Saves most money", "Builds motivation and momentum", "Fastest payoff", "Easiest to calculate"],
      correctAnswer: 1,
      explanation: "The main advantage is psychological - it builds motivation through quick wins, helping people stick with debt payoff."
    },
    {
      id: 5,
      question: "While paying off one debt, what should you do with others?",
      options: ["Ignore them", "Pay minimums on others, focus extra on target debt", "Pay nothing", "Increase spending"],
      correctAnswer: 1,
      explanation: "Pay minimum payments on all other debts while putting all extra money toward your target debt."
    },
    {
      id: 6,
      question: "The snowball method is best for people who:",
      options: ["Need motivation", "Want to save the most interest", "Have only one debt", "Don't like math"],
      correctAnswer: 0,
      explanation: "The snowball method is ideal for people who need motivation and psychological wins to stay committed."
    },
    {
      id: 7,
      question: "What's the alternative to the snowball method?",
      options: ["Debt avalanche", "Debt consolidation", "Bankruptcy", "Ignoring debt"],
      correctAnswer: 0,
      explanation: "The Debt Avalanche method pays highest interest rates first, which saves more money but may take longer for first win."
    },
    {
      id: 8,
      question: "How do you list debts for the snowball method?",
      options: ["By interest rate", "By balance (smallest to largest)", "Alphabetically", "By due date"],
      correctAnswer: 1,
      explanation: "List debts from smallest balance to largest, regardless of interest rate."
    },
    {
      id: 9,
      question: "The 'snowball' effect refers to:",
      options: ["Debt growing", "Payments getting larger as you pay off debts", "Interest compounding", "Minimum payments"],
      correctAnswer: 1,
      explanation: "As you pay off each debt, you roll that payment into the next, creating a 'snowball' effect of increasing payments."
    },
    {
      id: 10,
      question: "Should you continue the snowball method even if you get a raise?",
      options: ["Yes, use extra income to accelerate", "No, spend the raise", "Maybe", "Only sometimes"],
      correctAnswer: 0,
      explanation: "Use any extra income (raises, bonuses) to accelerate your debt snowball - don't increase lifestyle spending."
    },
    {
      id: 11,
      question: "What's the first step in the debt snowball method?",
      options: ["List all debts", "Get a loan", "Stop paying", "Spend more"],
      correctAnswer: 0,
      explanation: "First, list all your debts from smallest to largest balance to see your complete debt picture."
    },
    {
      id: 12,
      question: "The snowball method works because:",
      options: ["It's mathematically superior", "It creates behavioral change through quick wins", "It's the fastest", "It's easiest"],
      correctAnswer: 1,
      explanation: "The method works because quick wins create behavioral change and motivation, helping people stick with debt payoff long-term."
    }
  ],
  6: [ // Diversification
    {
      id: 1,
      question: "What is diversification?",
      options: ["Putting all money in one stock", "Spreading investments across different assets", "Only investing in stocks", "Avoiding investments"],
      correctAnswer: 1,
      explanation: "Diversification means spreading investments across different asset classes, sectors, and geographic regions to reduce risk."
    },
    {
      id: 2,
      question: "Why is diversification important?",
      options: ["Guarantees returns", "Reduces risk by not putting all eggs in one basket", "Increases returns", "Makes investing easier"],
      correctAnswer: 1,
      explanation: "Diversification reduces risk - if one investment performs poorly, others may perform well, balancing your portfolio."
    },
    {
      id: 3,
      question: "What does 'don't put all eggs in one basket' mean?",
      options: ["Don't invest", "Diversify your investments", "Only use baskets", "Save everything"],
      correctAnswer: 1,
      explanation: "This saying means don't invest everything in one asset - spread it across different investments to reduce risk."
    },
    {
      id: 4,
      question: "What are the main asset classes for diversification?",
      options: ["Only stocks", "Stocks, bonds, real estate, cash", "Only bonds", "Cryptocurrency only"],
      correctAnswer: 1,
      explanation: "Main asset classes include stocks, bonds, real estate, and cash equivalents - each behaves differently in market conditions."
    },
    {
      id: 5,
      question: "How many stocks should you own for good diversification?",
      options: ["1-5", "10-15 minimum, or use index funds", "100+", "Doesn't matter"],
      correctAnswer: 1,
      explanation: "For individual stocks, own at least 10-15 across different sectors, or use index funds/ETFs for instant diversification."
    },
    {
      id: 6,
      question: "What is an index fund?",
      options: ["A single stock", "A fund tracking a market index (like S&P 500)", "A bond", "Cash"],
      correctAnswer: 1,
      explanation: "Index funds track market indexes and provide instant diversification across hundreds of companies in one investment."
    },
    {
      id: 7,
      question: "Diversification helps protect against:",
      options: ["All losses", "Company-specific or sector-specific risks", "Market crashes", "Inflation"],
      correctAnswer: 1,
      explanation: "Diversification protects against company or sector-specific risks, but can't eliminate market-wide risks."
    },
    {
      id: 8,
      question: "Can you over-diversify?",
      options: ["No, more is always better", "Yes, too many holdings can dilute returns", "Never", "Only with stocks"],
      correctAnswer: 1,
      explanation: "Yes - over-diversification (100+ holdings) can dilute returns and make portfolio management difficult without added benefit."
    },
    {
      id: 9,
      question: "What is geographic diversification?",
      options: ["Only US investments", "Investing in different countries/regions", "Local investments only", "Avoiding foreign markets"],
      correctAnswer: 1,
      explanation: "Geographic diversification means investing in different countries and regions to reduce country-specific economic risks."
    },
    {
      id: 10,
      question: "Bonds in a portfolio help with diversification because:",
      options: ["They always go up", "They often move opposite to stocks", "They're risk-free", "They pay dividends"],
      correctAnswer: 1,
      explanation: "Bonds often move opposite to stocks - when stocks fall, bonds may rise, providing portfolio balance."
    },
    {
      id: 11,
      question: "What's a well-diversified portfolio typically include?",
      options: ["Only tech stocks", "Mix of stocks, bonds, and other assets", "Only bonds", "Only cash"],
      correctAnswer: 1,
      explanation: "A well-diversified portfolio includes a mix of stocks (domestic/international), bonds, and potentially real estate or other assets."
    },
    {
      id: 12,
      question: "The main benefit of diversification is:",
      options: ["Higher guaranteed returns", "Reduced risk without necessarily reducing returns", "No risk", "Faster growth"],
      correctAnswer: 1,
      explanation: "Diversification reduces risk (volatility) without necessarily reducing expected returns - it's about risk management."
    }
  ],
  7: [ // Automated Savings
    {
      id: 1,
      question: "What is automated savings?",
      options: ["Manual transfers", "Automatic transfers to savings account", "Spending automatically", "No savings"],
      correctAnswer: 1,
      explanation: "Automated savings means setting up automatic transfers from checking to savings, so you save without thinking about it."
    },
    {
      id: 2,
      question: "Why is 'pay yourself first' important?",
      options: ["It's not", "Saves money before you can spend it", "Pays bills first", "Spends money"],
      correctAnswer: 1,
      explanation: "Paying yourself first means saving before spending - if you wait until the end of the month, there's often nothing left."
    },
    {
      id: 3,
      question: "How much should you automate for savings?",
      options: ["Nothing", "Whatever you can afford, even $25/month", "Only large amounts", "Everything"],
      correctAnswer: 1,
      explanation: "Start with any amount you can afford - even $25-50/month adds up. Increase it gradually as your income grows."
    },
    {
      id: 4,
      question: "What's the benefit of automating savings?",
      options: ["No benefit", "Removes temptation and builds habit", "Makes you spend more", "Complicates things"],
      correctAnswer: 1,
      explanation: "Automation removes the temptation to skip saving and builds a consistent saving habit without willpower."
    },
    {
      id: 5,
      question: "When should automated savings transfers happen?",
      options: ["End of month", "Right after you get paid", "Randomly", "Never"],
      correctAnswer: 1,
      explanation: "Set transfers to happen right after payday - you'll never miss the money because it's saved before you see it."
    },
    {
      id: 6,
      question: "$50/month automated for 10 years at 5% equals approximately:",
      options: ["$6,000", "$7,800", "$8,200", "$10,000"],
      correctAnswer: 1,
      explanation: "With compound interest, $50/month for 10 years at 5% grows to approximately $7,800 - much more than $6,000!"
    },
    {
      id: 7,
      question: "What's the 'set it and forget it' advantage?",
      options: ["No thinking required", "Requires constant attention", "Doesn't work", "Too complicated"],
      correctAnswer: 0,
      explanation: "Once automated, you don't need to remember or make decisions - savings happen automatically, building wealth passively."
    },
    {
      id: 8,
      question: "Should you automate even small amounts?",
      options: ["No, wait until you can save more", "Yes, small amounts add up over time", "Only large amounts", "Never automate"],
      correctAnswer: 1,
      explanation: "Yes! Small amounts compound over time. $25/month becomes $3,000+ in 10 years with interest - start small and increase."
    },
    {
      id: 9,
      question: "What percentage of income should you automate to savings?",
      options: ["0%", "At least 10-20%", "50%", "100%"],
      correctAnswer: 1,
      explanation: "Aim to automate at least 10-20% of income to savings, but start with whatever you can and increase gradually."
    },
    {
      id: 10,
      question: "Automated savings helps with:",
      options: ["Spending more", "Building emergency fund and wealth without effort", "Complicating finances", "Nothing"],
      correctAnswer: 1,
      explanation: "Automation helps build emergency funds, retirement savings, and other goals without requiring constant decision-making."
    },
    {
      id: 11,
      question: "What should you do if you get a raise?",
      options: ["Spend it all", "Increase automated savings by part of the raise", "Stop saving", "Nothing"],
      correctAnswer: 1,
      explanation: "When you get a raise, increase your automated savings by at least part of it - you were living without it before."
    },
    {
      id: 12,
      question: "The key to automated savings success is:",
      options: ["Large amounts only", "Starting and being consistent", "Perfect timing", "Waiting until you're ready"],
      correctAnswer: 1,
      explanation: "The key is starting (even small) and being consistent - automation makes consistency easy and builds wealth over time."
    }
  ],
  8: [ // Tax-Advantaged Accounts
    {
      id: 1,
      question: "What is a 401(k)?",
      options: ["A savings account", "Employer-sponsored retirement account", "A loan", "A credit card"],
      correctAnswer: 1,
      explanation: "A 401(k) is an employer-sponsored retirement account that offers tax advantages for saving for retirement."
    },
    {
      id: 2,
      question: "What is an employer match?",
      options: ["Free money from employer", "A loan", "A penalty", "Nothing"],
      correctAnswer: 0,
      explanation: "Employer match is free money - your employer contributes money to your 401(k) when you contribute, up to a limit."
    },
    {
      id: 3,
      question: "Why should you contribute enough to get the full employer match?",
      options: ["You shouldn't", "It's free money - 100% return", "It's required", "No reason"],
      correctAnswer: 1,
      explanation: "Getting the full match is like getting a 100% return immediately - it's free money you shouldn't leave on the table."
    },
    {
      id: 4,
      question: "What is an IRA?",
      options: ["Individual Retirement Account", "A type of loan", "A savings account", "A credit card"],
      correctAnswer: 0,
      explanation: "IRA stands for Individual Retirement Account - a tax-advantaged retirement account you open yourself."
    },
    {
      id: 5,
      question: "What's the main tax advantage of traditional 401(k) and IRA?",
      options: ["No taxes ever", "Contributions reduce taxable income now", "Free money", "No limits"],
      correctAnswer: 1,
      explanation: "Traditional accounts let you contribute pre-tax money, reducing your taxable income now. You pay taxes when you withdraw."
    },
    {
      id: 6,
      question: "What's a Roth IRA?",
      options: ["Traditional IRA", "Contributions are after-tax, but withdrawals are tax-free", "A savings account", "A loan"],
      correctAnswer: 1,
      explanation: "Roth IRA uses after-tax contributions, but qualified withdrawals in retirement are completely tax-free."
    },
    {
      id: 7,
      question: "What's the 2024 contribution limit for 401(k)?",
      options: ["$6,500", "$7,000", "$23,000", "$30,000"],
      correctAnswer: 2,
      explanation: "The 2024 401(k) contribution limit is $23,000 (plus catch-up contributions of $7,500 if 50+)."
    },
    {
      id: 8,
      question: "Why are tax-advantaged accounts powerful?",
      options: ["No benefits", "Tax savings and compound growth on untaxed money", "They're free", "No limits"],
      correctAnswer: 1,
      explanation: "Tax advantages mean your money grows without annual taxes, and you save on taxes - this compounds significantly over time."
    },
    {
      id: 9,
      question: "When can you withdraw from retirement accounts without penalty?",
      options: ["Anytime", "Age 59.5+ for most accounts", "Never", "Age 65"],
      correctAnswer: 1,
      explanation: "Most retirement accounts allow penalty-free withdrawals starting at age 59.5, though earlier withdrawals may have penalties."
    },
    {
      id: 10,
      question: "What should you do if your employer offers a 401(k) match?",
      options: ["Ignore it", "Contribute at least enough to get full match", "Only contribute minimum", "Wait"],
      correctAnswer: 1,
      explanation: "Always contribute at least enough to get the full employer match - it's free money and an instant return on investment."
    },
    {
      id: 11,
      question: "Traditional vs Roth: which is better?",
      options: ["Traditional always", "Roth always", "Depends on current vs future tax bracket", "Neither"],
      correctAnswer: 2,
      explanation: "It depends - if you expect higher taxes in retirement, Roth is better. If lower, traditional may be better. Many use both."
    },
    {
      id: 12,
      question: "The power of tax-advantaged accounts comes from:",
      options: ["No benefits", "Tax savings + compound growth on larger balance", "Free money", "No limits"],
      correctAnswer: 1,
      explanation: "Tax-advantaged accounts let you invest more (due to tax savings) and that larger balance compounds tax-free over decades."
    }
  ],
  9: [ // Credit Score Basics
    {
      id: 1,
      question: "What is a credit score?",
      options: ["Your bank balance", "A number representing creditworthiness (300-850)", "Your age", "Your income"],
      correctAnswer: 1,
      explanation: "A credit score (typically 300-850) represents how likely you are to repay debt - higher scores mean better creditworthiness."
    },
    {
      id: 2,
      question: "What's considered a good credit score?",
      options: ["Below 600", "670-739 (good), 740+ (very good)", "Exactly 700", "Above 900"],
      correctAnswer: 1,
      explanation: "Scores 670-739 are considered good, 740-799 very good, and 800+ excellent. Below 580 is poor."
    },
    {
      id: 3,
      question: "What's the biggest factor affecting your credit score?",
      options: ["Income", "Payment history (35%)", "Age", "Location"],
      correctAnswer: 1,
      explanation: "Payment history is 35% of your score - paying bills on time is the most important factor."
    },
    {
      id: 4,
      question: "What is credit utilization?",
      options: ["Your income", "How much credit you use vs available (keep below 30%)", "Your age", "Your savings"],
      correctAnswer: 1,
      explanation: "Credit utilization is the percentage of available credit you're using. Keep it below 30% for best scores."
    },
    {
      id: 5,
      question: "How does payment history affect your score?",
      options: ["Doesn't matter", "Late payments hurt significantly, on-time payments help", "Only matters sometimes", "No impact"],
      correctAnswer: 1,
      explanation: "Payment history is 35% of your score - even one late payment can drop your score significantly."
    },
    {
      id: 6,
      question: "How long does negative information stay on your credit report?",
      options: ["1 year", "7 years (10 for bankruptcy)", "Forever", "30 days"],
      correctAnswer: 1,
      explanation: "Most negative information stays 7 years, bankruptcies 10 years. Positive information can stay longer."
    },
    {
      id: 7,
      question: "What's credit utilization percentage should you aim for?",
      options: ["100%", "Below 30%", "50%", "Doesn't matter"],
      correctAnswer: 1,
      explanation: "Keep credit utilization below 30% - lower is better. High utilization suggests you're overextended."
    },
    {
      id: 8,
      question: "How does length of credit history help?",
      options: ["Doesn't matter", "Longer history shows reliability and improves score", "Hurts score", "No impact"],
      correctAnswer: 1,
      explanation: "Longer credit history (15% of score) shows you're experienced with credit and can manage it responsibly."
    },
    {
      id: 9,
      question: "What types of credit help your score?",
      options: ["Only credit cards", "Mix of credit cards, loans, mortgages", "Only loans", "Only cash"],
      correctAnswer: 1,
      explanation: "A mix of credit types (10% of score) - credit cards, auto loans, mortgages - shows you can handle different credit."
    },
    {
      id: 10,
      question: "How often should you check your credit score?",
      options: ["Never", "At least annually (free at annualcreditreport.com)", "Daily", "Only when applying"],
      correctAnswer: 1,
      explanation: "Check your credit report at least annually for free at annualcreditreport.com to catch errors and monitor your score."
    },
    {
      id: 11,
      question: "What should you do if you find errors on your credit report?",
      options: ["Ignore them", "Dispute them with credit bureaus", "Nothing", "Accept them"],
      correctAnswer: 1,
      explanation: "Dispute errors immediately with the credit bureaus (Equifax, Experian, TransUnion) - they must investigate."
    },
    {
      id: 12,
      question: "Why is a good credit score important?",
      options: ["It's not", "Better rates on loans, credit cards, mortgages - saves thousands", "No benefit", "Only for loans"],
      correctAnswer: 1,
      explanation: "Good credit scores get you better interest rates, saving thousands over time on mortgages, car loans, and credit cards."
    }
  ],
  10: [ // ROI Calculation
    {
      id: 1,
      question: "What does ROI stand for?",
      options: ["Rate of Interest", "Return on Investment", "Return of Income", "Rate of Income"],
      correctAnswer: 1,
      explanation: "ROI stands for Return on Investment - it measures how much profit you make relative to what you invested."
    },
    {
      id: 2,
      question: "What's the ROI formula?",
      options: ["(Gain - Cost) / Cost × 100", "Cost / Gain × 100", "Gain × Cost", "Gain + Cost"],
      correctAnswer: 0,
      explanation: "ROI = (Gain from Investment - Cost of Investment) / Cost of Investment × 100 to get a percentage."
    },
    {
      id: 3,
      question: "If you invest $1,000 and it's worth $1,200, what's your ROI?",
      options: ["20%", "120%", "200%", "12%"],
      correctAnswer: 0,
      explanation: "ROI = ($1,200 - $1,000) / $1,000 × 100 = $200 / $1,000 × 100 = 20%."
    },
    {
      id: 4,
      question: "Why is ROI important?",
      options: ["It's not", "Compares investment performance and helps make decisions", "Only for stocks", "Doesn't matter"],
      correctAnswer: 1,
      explanation: "ROI helps you compare different investments and decide which ones are worth your money."
    },
    {
      id: 5,
      question: "What's a good ROI to aim for?",
      options: ["0%", "Above inflation rate (typically 7-10% for stocks long-term)", "Exactly 5%", "100%"],
      correctAnswer: 1,
      explanation: "Aim for ROI above inflation. Stocks historically return 7-10% annually over long periods, which beats inflation."
    },
    {
      id: 6,
      question: "ROI should be compared to:",
      options: ["Nothing", "Inflation rate and alternative investments", "Your income", "Your age"],
      correctAnswer: 1,
      explanation: "Compare ROI to inflation (to maintain purchasing power) and alternative investments to make the best choice."
    },
    {
      id: 7,
      question: "What's the difference between ROI and annualized ROI?",
      options: ["Same thing", "Annualized adjusts for time period", "No difference", "ROI is better"],
      correctAnswer: 1,
      explanation: "Annualized ROI adjusts for the time period, so you can compare investments held for different lengths of time."
    },
    {
      id: 8,
      question: "If an investment has negative ROI, it means:",
      options: ["You made money", "You lost money", "Break even", "Can't tell"],
      correctAnswer: 1,
      explanation: "Negative ROI means you lost money - the investment is worth less than what you paid for it."
    },
    {
      id: 9,
      question: "ROI helps you decide:",
      options: ["Nothing", "Which investments are worth your money", "Your income", "Your age"],
      correctAnswer: 1,
      explanation: "ROI helps you compare investments and decide which ones provide the best return for your money."
    },
    {
      id: 10,
      question: "What should you consider besides ROI?",
      options: ["Nothing", "Risk, time horizon, and your goals", "Only risk", "Only time"],
      correctAnswer: 1,
      explanation: "Consider risk (higher ROI often means higher risk), your time horizon, and financial goals, not just ROI."
    },
    {
      id: 11,
      question: "A 10% ROI over 1 year vs 7% over 10 years:",
      options: ["10% is always better", "Consider time and compound growth", "Same", "7% is always better"],
      correctAnswer: 1,
      explanation: "Consider compound growth over time - 7% for 10 years with compounding may outperform 10% for 1 year."
    },
    {
      id: 12,
      question: "The key to using ROI effectively is:",
      options: ["Only look at ROI", "Compare ROI to inflation and alternatives, consider risk", "Ignore it", "Always choose highest"],
      correctAnswer: 1,
      explanation: "Use ROI as one tool - compare to inflation, consider alternatives, and factor in risk - don't chase highest ROI blindly."
    }
  ],
  11: [ // Budgeting Apps
    {
      id: 1,
      question: "What's the first step to gaining control of your finances?",
      options: ["Invest immediately", "Track your spending for 30 days", "Open new accounts", "Spend less"],
      correctAnswer: 1,
      explanation: "Track every expense for 30 days to understand where your money actually goes - knowledge is the first step."
    },
    {
      id: 2,
      question: "Why track expenses for 30 days?",
      options: ["No reason", "Reveals spending patterns you didn't realize", "It's required", "For fun"],
      correctAnswer: 1,
      explanation: "30 days reveals your true spending patterns - you'll likely find expenses you forgot about or didn't realize were so high."
    },
    {
      id: 3,
      question: "What should you track?",
      options: ["Only large purchases", "Every single expense, no matter how small", "Only bills", "Only food"],
      correctAnswer: 1,
      explanation: "Track every expense - small purchases add up. That $5 coffee daily is $150/month and $1,800/year!"
    },
    {
      id: 4,
      question: "What categories should you track?",
      options: ["Only one", "Housing, food, transportation, entertainment, bills, etc.", "Only food", "Only bills"],
      correctAnswer: 1,
      explanation: "Track all categories: housing, food, transportation, entertainment, bills, subscriptions, shopping, etc."
    },
    {
      id: 5,
      question: "After tracking, what's the next step?",
      options: ["Nothing", "Categorize and identify areas to reduce spending", "Spend more", "Ignore results"],
      correctAnswer: 1,
      explanation: "After tracking, categorize expenses and identify areas where you can reduce spending without major lifestyle changes."
    },
    {
      id: 6,
      question: "What's a common surprise when tracking expenses?",
      options: ["Nothing surprising", "Small recurring expenses add up significantly", "Everything is expected", "No patterns"],
      correctAnswer: 1,
      explanation: "People are often surprised how small expenses (subscriptions, coffee, snacks) add up to hundreds per month."
    },
    {
      id: 7,
      question: "How often should you review your spending?",
      options: ["Never", "Weekly or monthly to stay aware", "Yearly", "Only when broke"],
      correctAnswer: 1,
      explanation: "Review spending weekly or monthly to stay aware and catch problems early before they become big issues."
    },
    {
      id: 8,
      question: "What's the benefit of using budgeting apps?",
      options: ["No benefit", "Automatic tracking, categorization, and insights", "They're expensive", "Too complicated"],
      correctAnswer: 1,
      explanation: "Budgeting apps automatically track expenses, categorize them, and provide insights - making budgeting much easier."
    },
    {
      id: 9,
      question: "What should you do with the information from tracking?",
      options: ["Ignore it", "Create a budget based on actual spending patterns", "Spend more", "Nothing"],
      correctAnswer: 1,
      explanation: "Use tracking data to create a realistic budget based on your actual spending, then adjust categories as needed."
    },
    {
      id: 10,
      question: "Tracking expenses helps you:",
      options: ["Spend more", "Make informed decisions about where your money goes", "Nothing", "Complicate things"],
      correctAnswer: 1,
      explanation: "Tracking gives you the knowledge to make informed decisions about spending and identify areas for improvement."
    },
    {
      id: 11,
      question: "What's the 'latte factor'?",
      options: ["Nothing", "Small daily expenses that add up significantly over time", "Only coffee", "A myth"],
      correctAnswer: 1,
      explanation: "The 'latte factor' refers to small daily expenses that seem insignificant but add up to significant amounts annually."
    },
    {
      id: 12,
      question: "The key to successful budgeting is:",
      options: ["Perfect tracking", "Starting to track and being consistent", "Never spending", "Ignoring expenses"],
      correctAnswer: 1,
      explanation: "The key is starting to track (even imperfectly) and being consistent - awareness leads to better financial decisions."
    }
  ],
  12: [ // Financial Goals
    {
      id: 1,
      question: "What does SMART stand for in goal setting?",
      options: ["Simple, Measurable, Achievable, Relevant, Time-bound", "Smart, Money, Account, Rate, Tax", "Save, Manage, Account, Rate, Time", "Spend, Manage, Account, Rate, Tax"],
      correctAnswer: 0,
      explanation: "SMART goals are: Specific, Measurable, Achievable, Relevant, and Time-bound - this framework makes goals actionable."
    },
    {
      id: 2,
      question: "What does 'Specific' mean in SMART goals?",
      options: ["Vague", "Clear and well-defined (e.g., 'Save $10,000 for emergency fund')", "General", "Unclear"],
      correctAnswer: 1,
      explanation: "Specific means clear and well-defined - 'Save $10,000 emergency fund' is better than 'save money'."
    },
    {
      id: 3,
      question: "What does 'Measurable' mean?",
      options: ["Can't measure", "You can track progress with numbers", "Guess", "Unknown"],
      correctAnswer: 1,
      explanation: "Measurable means you can track progress - 'Save $500/month' is measurable, 'save more' is not."
    },
    {
      id: 4,
      question: "What does 'Achievable' mean?",
      options: ["Impossible", "Realistic and attainable given your resources", "Too easy", "Dream only"],
      correctAnswer: 1,
      explanation: "Achievable means realistic - set goals you can actually reach with your income and circumstances."
    },
    {
      id: 5,
      question: "What does 'Relevant' mean?",
      options: ["Doesn't matter", "Aligned with your values and long-term objectives", "Random", "Unimportant"],
      correctAnswer: 1,
      explanation: "Relevant means the goal matters to you and aligns with your values and long-term financial objectives."
    },
    {
      id: 6,
      question: "What does 'Time-bound' mean?",
      options: ["No deadline", "Has a specific deadline or timeframe", "Forever", "Maybe someday"],
      correctAnswer: 1,
      explanation: "Time-bound means having a deadline - 'Save $10,000 by December 2025' creates urgency and focus."
    },
    {
      id: 7,
      question: "How often should you review financial goals?",
      options: ["Never", "Quarterly or when circumstances change", "Yearly only", "Daily"],
      correctAnswer: 1,
      explanation: "Review goals quarterly or when your circumstances change (new job, raise, life events) to keep them relevant."
    },
    {
      id: 8,
      question: "What should you do if you're not meeting a goal?",
      options: ["Give up", "Adjust the goal or strategy, don't abandon it", "Ignore it", "Spend more"],
      correctAnswer: 1,
      explanation: "If you're not meeting a goal, adjust it (make it more realistic) or change your strategy - don't give up entirely."
    },
    {
      id: 9,
      question: "What types of financial goals should you have?",
      options: ["Only one", "Short-term (emergency fund), medium-term (house), long-term (retirement)", "Only retirement", "Only short-term"],
      correctAnswer: 1,
      explanation: "Have a mix: short-term (emergency fund), medium-term (house down payment), and long-term (retirement) goals."
    },
    {
      id: 10,
      question: "Why write down your financial goals?",
      options: ["No reason", "Increases likelihood of achieving them", "Doesn't help", "Waste of time"],
      correctAnswer: 1,
      explanation: "Writing down goals increases your likelihood of achieving them - it makes them concrete and keeps you focused."
    },
    {
      id: 11,
      question: "What should you do after setting a SMART goal?",
      options: ["Nothing", "Break it into smaller steps and create an action plan", "Forget it", "Wait"],
      correctAnswer: 1,
      explanation: "Break the goal into smaller steps and create a monthly/weekly action plan - big goals need small steps."
    },
    {
      id: 12,
      question: "The power of SMART goals is:",
      options: ["They're easy", "They turn vague wishes into actionable plans", "They guarantee success", "No power"],
      correctAnswer: 1,
      explanation: "SMART goals transform vague wishes ('I want to save money') into specific, actionable plans you can actually achieve."
    }
  ]
};
