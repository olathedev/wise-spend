import apiClient from "./axios";

// Using Alpha Vantage API (free tier)
// Get your free API key at: https://www.alphavantage.co/support/#api-key
// Alternative APIs: Finnhub (https://finnhub.io/), Financial Modeling Prep, or IEX Cloud
// Note: Free tier has rate limits (5 calls/minute, 500 calls/day)
const ALPHA_VANTAGE_API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY || "demo";
const ALPHA_VANTAGE_BASE_URL = "https://www.alphavantage.co/query";

export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
}

export interface CompanyOverview {
  symbol: string;
  name: string;
  description: string;
  sector: string;
  industry: string;
  marketCap: string;
  peRatio: string;
  dividendYield: string;
  beta: string;
  "52WeekHigh": string;
  "52WeekLow": string;
}

export interface TopGainer {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

/**
 * Fetch real-time stock quote
 */
export async function getStockQuote(symbol: string): Promise<StockQuote | null> {
  try {
    const response = await fetch(
      `${ALPHA_VANTAGE_BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
    );
    const data = await response.json();
    
    if (data["Error Message"] || data["Note"]) {
      console.error("Alpha Vantage API error:", data["Error Message"] || data["Note"]);
      return null;
    }

    const quote = data["Global Quote"];
    if (!quote || !quote["05. price"]) {
      return null;
    }

    const price = parseFloat(quote["05. price"]);
    const previousClose = parseFloat(quote["08. previous close"]);
    const change = price - previousClose;
    const changePercent = (change / previousClose) * 100;

    return {
      symbol: quote["01. symbol"],
      name: quote["01. symbol"], // Alpha Vantage doesn't provide name in quote
      price,
      change,
      changePercent,
      volume: parseInt(quote["06. volume"]) || 0,
      high: parseFloat(quote["03. high"]) || price,
      low: parseFloat(quote["04. low"]) || price,
      open: parseFloat(quote["02. open"]) || price,
      previousClose,
    };
  } catch (error) {
    console.error("Error fetching stock quote:", error);
    return null;
  }
}

/**
 * Fetch company overview
 */
export async function getCompanyOverview(symbol: string): Promise<CompanyOverview | null> {
  try {
    const response = await fetch(
      `${ALPHA_VANTAGE_BASE_URL}?function=OVERVIEW&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
    );
    const data = await response.json();
    
    if (data["Error Message"] || data["Note"] || !data.Name) {
      console.error("Alpha Vantage API error:", data["Error Message"] || data["Note"]);
      return null;
    }

    return {
      symbol: data.Symbol,
      name: data.Name,
      description: data.Description || "",
      sector: data.Sector || "",
      industry: data.Industry || "",
      marketCap: data.MarketCapitalization || "N/A",
      peRatio: data.PERatio || "N/A",
      dividendYield: data.DividendYield || "0%",
      beta: data.Beta || "N/A",
      "52WeekHigh": data["52WeekHigh"] || "N/A",
      "52WeekLow": data["52WeekLow"] || "N/A",
    };
  } catch (error) {
    console.error("Error fetching company overview:", error);
    return null;
  }
}

/**
 * Fetch top gainers (using TOP_GAINERS_LOSERS function)
 */
export async function getTopGainers(): Promise<TopGainer[]> {
  try {
    const response = await fetch(
      `${ALPHA_VANTAGE_BASE_URL}?function=TOP_GAINERS_LOSERS&apikey=${ALPHA_VANTAGE_API_KEY}`
    );
    const data = await response.json();
    
    if (data["Error Message"] || data["Note"]) {
      console.error("Alpha Vantage API error:", data["Error Message"] || data["Note"]);
      return [];
    }

    const topGainers = data.top_gainers || [];
    return topGainers.slice(0, 8).map((item: any) => ({
      symbol: item.ticker,
      name: item.ticker, // Alpha Vantage doesn't provide name
      price: parseFloat(item.price) || 0,
      change: parseFloat(item.change_amount) || 0,
      changePercent: parseFloat(item.change_percentage?.replace("%", "")) || 0,
    }));
  } catch (error) {
    console.error("Error fetching top gainers:", error);
    return [];
  }
}

/**
 * Get popular investment opportunities (ETFs and major stocks)
 * Returns a mix of popular ETFs and stocks with real-time data
 */
export async function getInvestmentOpportunities(): Promise<Array<{
  symbol: string;
  name: string;
  type: string;
  price: number;
  changePercent: number;
  description: string;
  sector?: string;
}>> {
  // Popular ETFs and major stocks for investment opportunities
  const popularSymbols = [
    { symbol: "SPY", name: "SPDR S&P 500 ETF", type: "ETF", description: "Tracks S&P 500 index" },
    { symbol: "VTI", name: "Vanguard Total Stock Market ETF", type: "ETF", description: "Broad US market exposure" },
    { symbol: "VEA", name: "Vanguard FTSE Developed Markets ETF", type: "ETF", description: "International developed markets" },
    { symbol: "BND", name: "Vanguard Total Bond Market ETF", type: "ETF", description: "Diversified bond exposure" },
    { symbol: "VNQ", name: "Vanguard Real Estate ETF", type: "ETF", description: "Real estate investment trust" },
    { symbol: "AAPL", name: "Apple Inc.", type: "Stock", description: "Technology sector leader" },
    { symbol: "MSFT", name: "Microsoft Corporation", type: "Stock", description: "Cloud and software leader" },
    { symbol: "GOOGL", name: "Alphabet Inc.", type: "Stock", description: "Technology and advertising" },
  ];

  const opportunities = await Promise.all(
    popularSymbols.map(async (item) => {
      const quote = await getStockQuote(item.symbol);
      if (!quote) return null;

      const overview = await getCompanyOverview(item.symbol);
      
      return {
        symbol: quote.symbol,
        name: overview?.name || item.name,
        type: item.type,
        price: quote.price,
        changePercent: quote.changePercent,
        description: overview?.description || item.description,
        sector: overview?.sector,
      };
    })
  );

  // Filter out null results and return
  return opportunities.filter((item): item is NonNullable<typeof item> => item !== null);
}
