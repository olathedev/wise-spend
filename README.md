# 💰 WiseSpend

> **Transform Financial Fog Into Actionable Resilience Through AI-Powered Receipt Intelligence**

[![Built for Comet Hackathon](https://img.shields.io/badge/Built%20for-Comet%20AI%20Agents%20Hackathon-blue)](https://comet.com)
[![Powered by Opik](https://img.shields.io/badge/Powered%20by-Opik-purple)](https://comet.com/opik)
[![Gemini 2.5 Flash](https://img.shields.io/badge/Gemini-2.5%20Flash-orange)](https://ai.google.dev)

**For judges:** This README is structured so you can quickly see the problem, solution, architecture, **all features (including the Grow page)**, and a suggested evaluation path. Use **Product at a Glance** and **Demo Scenarios** to know what to try in the app; use **Evaluation Summary** for scoring alignment.

---

## 🎯 The Problem

**Most people don't realize what they're spending until it's too late.**

- "I'll just track it manually" → Gets forgotten after 3 days
- "I'll use a budgeting app" → Too generic, doesn't understand context
- "I already spent the money, why track it?" → Missing the point entirely

**The real issue:** People don't see the *trade-offs* of their spending decisions. That $6.50 latte isn't just coffee—it's 15 minutes of your future retirement, or 2 weeks further from your house deposit.

---

## 💡 Our Solution

**WiseSpend is an agentic, AI-first financial coach** that transforms "financial fog" into actionable resilience.

Instead of just tracking expenses, we:
1. **Scan receipts with Gemini 2.5 Flash** → Multimodal AI understands *what* you bought and *why* it matters
2. **Calculate real goal impact** → Shows you: *"That $100 purchase = 2 weeks further from your house deposit"*
3. **Socratic coaching** → Asks thought-provoking questions, not generic advice
4. **Full observability** → Every reasoning step traced in Opik for continuous improvement

**The receipt scan isn't about that ONE purchase — it's about building awareness so your NEXT 100 purchases are different.**

---

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           WISESPEND                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────┐     ┌──────────────┐     ┌─────────────────────────┐  │
│  │   Next.js   │────▶│   Express    │────▶│   Google GenAI Service  │  │
│  │   Frontend  │◀────│   Backend    │◀────│   (Gemini 2.5 Flash)    │  │
│  └─────────────┘     └──────────────┘     └─────────────────────────┘  │
│        │                    │                         │                 │
│        │                    ▼                         ▼                 │
│        │             ┌──────────────┐         ┌─────────────┐          │
│        │             │   MongoDB    │         │   Cloudinary│          │
│        │             │   Database   │         │  (Receipts) │          │
│        │             └──────────────┘         └─────────────┘          │
│        │                                             │                  │
│        │                    └────────────┬───────────┘                  │
│        │                                 ▼                              │
│        │                    ┌─────────────────────────┐                 │
│        └───────────────────▶│         OPIK            │                 │
│           (View Traces)     │  (Full Observability)   │                 │
│                             └─────────────────────────┘                 │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Receipt Analysis Reasoning Chain (Fully Traced in Opik)

```
    ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
    │   RECEIPT SCAN   │───▶│  IMAGE ANALYSIS  │───▶│  ITEM EXTRACTION │
    │                  │    │                  │    │                  │
    │ User uploads     │    │ Gemini 2.5 Flash │    │ Parse line items │
    │ receipt photo    │    │ Vision processes  │    │ Categorize items │
    │                  │    │                  │    │                  │
    └──────────────────┘    └──────────────────┘    └──────────────────┘
                                                              │
                                                              ▼
    ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
    │  GOAL IMPACT     │◀───│  SPENDING PATTERN│◀───│  CONTEXT ANALYSIS│
    │  CALCULATION     │    │  ANALYSIS        │    │                  │
    │                  │    │                  │    │ User history     │
    │ "This $100       │    │ "You usually     │    │ Financial goals  │
    │  purchase = 2    │    │  spend $X on     │    │ Monthly income   │
    │  weeks further   │    │  Fridays"        │    │                  │
    │  from goal"      │    │                  │    │                  │
    └──────────────────┘    └──────────────────┘    └──────────────────┘
                                                              │
                                                              ▼
    ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
    │  SOCRATIC COACH  │───▶│  INSIGHT          │───▶│  USER ACTION     │
    │  QUESTION        │    │  GENERATION       │    │                  │
    │                  │    │                  │    │ User sees        │
    │ "Is this worth   │    │ "15% spike in     │    │ trade-off, makes │
    │  delaying your   │    │  coffee spending  │    │ informed choice  │
    │  house deposit?" │    │  this week"       │    │                  │
    └──────────────────┘    └──────────────────┘    └──────────────────┘
    
    ⬆️ Every step traced in Opik with nested parent-child spans
```

### Grow Page Flow (Knowledge + Investments + Chat)

```
    ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
    │   USER OPENS      │───▶│  GROW PAGE       │───▶│  TWO TABS        │
    │   GROW            │    │                  │    │                  │
    │   (sidebar)       │    │  Learning &      │    │  Knowledge       │
    │                   │    │  Investing hub   │    │  | Investments   │
    └──────────────────┘    └──────────────────┘    └────────┬─────────┘
                                                              │
           ┌──────────────────────────────────────────────────┼──────────────────────────────────────────────────┐
           │                                                  │                                                  │
           ▼                                                  ▼                                                  ▼
    ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
    │  KNOWLEDGE TAB   │───▶│  LITERACY CARDS  │───▶│  GENERATE QUIZ   │───▶│  GEMINI CURATES  │───▶│  USER TAKES QUIZ │
    │                  │    │  12 topics       │    │  (5 questions)   │    │  5 MC questions  │    │  Score + explain │
    │  50/30/20,       │    │  Click topic     │    │  On demand       │    │  Traced in Opik  │    │  "New quiz"      │
    │  compound, etc.  │    │                  │    │                  │    │                  │    │  anytime         │
    └──────────────────┘    └──────────────────┘    └──────────────────┘    └──────────────────┘    └──────────────────┘
           │
           │
           ▼
    ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
    │  INVESTMENT TAB  │───▶│  ALPHA VANTAGE   │───▶│  CURATED LIST    │
    │                  │    │  Real-time data  │    │  ETFs, stocks    │
    │  Filters: type   │    │  Prices, % change│    │  Risk, min $     │
    │  Risk, sort      │    │                  │    │  Descriptions    │
    └──────────────────┘    └──────────────────┘    └────────┬─────────┘
                                                              │
                                                              ▼
    ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
    │  AI CHAT PANEL   │◀───│  CONTEXTUAL Q&A  │───▶│  USER ACTION     │
    │  (side of Grow)  │    │                  │    │                  │
    │                  │    │  "What is VTI?"  │    │  Informed about  │
    │  Same as AI      │    │  "Explain 50/30" │    │  concepts &      │
    │  Coach; Opik     │    │  Traced in Opik  │    │  opportunities   │
    │  traced          │    │                  │    │                  │
    └──────────────────┘    └──────────────────┘    └──────────────────┘

    ⬆️ Quiz generation and Grow chat traced in Opik (chat-gemini-2.5-flash, quiz generation spans)
```

### Opik Tracing Architecture

```
OPIK INTEGRATION
├── Trace Creation ──────────── Every AI call creates a trace
│   ├── chat-gemini-2.5-flash ─── Chat (AI Coach + Grow panel)
│   ├── analyze-receipt-image ─── Receipt analysis (main feature)
│   └── generate-quizzes ──────── Grow: AI-generated literacy quizzes
│
├── Nested Spans ─────────────── Detailed reasoning chain
│   ├── preprocess-receipt-image ─ Image preprocessing
│   ├── gemini-multimodal-analysis ─ LLM vision analysis
│   ├── calculate-goal-impact ─── Goal impact calculation
│   └── (Grow) quiz curation ───── Quiz generation for Knowledge tab
│
├── Error Handling ───────────── All errors logged to traces
│   └── Error metadata captured ─ Error type, message, stack
│
├── Token Usage Tracking ─────── Full cost observability
│   └── promptTokens, completionTokens, totalTokens
│
└── Graceful Shutdown ─────────── Auto-flush on SIGTERM/SIGINT
    └── Ensures all traces sent before exit
```

---

## ✨ Core Features

### 📸 Multimodal Receipt Scanning
**Snap a photo, understand the impact.**

- **Gemini 2.5 Flash Vision**: Uses Gemini 2.5 Flash's multimodal capabilities to parse unstructured receipt images
- **Intent Recognition**: Distinguishes "necessity" from "luxury" (not just OCR)
- **Automatic Categorization**: Smart categorization of line items
- **Full Opik Tracing**: Every step from image → analysis → insight is traced

### 🤔 Socratic Financial Coaching
**Ask questions, not commands.**

Instead of: *"You spent too much on coffee"*

We ask: *"Is that $6.50 latte worth 15 minutes of your future retirement?"*

- **Thought-Provoking Questions**: Helps users discover their own financial insights
- **Goal-Aware**: Every question references your actual financial goals
- **Pattern Recognition**: Identifies spending patterns over time
- **Supportive but Firm**: Tone tuned via Opik Agent Optimizer

### 🎯 Goal Impact Calculation
**See the real cost of every purchase.**

- **Real-Time Calculations**: Shows how each purchase affects your goals
- **Visual Trade-offs**: *"That $100 purchase = 2 weeks further from your house deposit"*
- **Historical Context**: Compares current spending to past patterns
- **Actionable Insights**: Not just data, but meaning

### 🛡️ Safety & Moderation (Opik Evaluation)
**Ensures our coach never goes rogue.**

- **ModerationMetric**: Prevents suggesting high-risk investments
- **HallucinationMetric**: Ensures accurate balance data
- **LLM-as-a-Judge**: Continuous evaluation of AI responses
- **Regression Testing**: 50+ edge-case financial scenarios in Opik

### 📊 Financial Dashboard
- **Wise Score**: Your financial resilience score (0-100)
- **Monthly Spending**: Real-time spending tracking
- **Emergency Fund**: Safety net visualization
- **Transaction History**: All scanned receipts with insights
- **Analytics**: Spending patterns, trends, and predictions

### 🎓 Gamified Financial Learning (AI-Curated)
**Learn financial concepts through interactive quizzes.**

- **12 Financial Literacy Topics**: Covering budgeting, investing, debt management, and more
  - The 50/30/20 Rule
  - Compound Growth
  - Inflation vs. Cash
  - Emergency Fund Basics
  - Debt Snowball Method
  - Diversification
  - Automated Savings
  - Tax-Advantaged Accounts
  - Credit Score Basics
  - ROI Calculation
  - Budgeting Apps
  - Financial Goals (SMART framework)

- **Interactive Quiz System**: 
  - Click any literacy card to start a quiz
  - Multiple-choice questions with explanations
  - Progress tracking and completion rewards
  - AI-curated content tailored to your financial profile

- **Gamification Elements**:
  - Visual progress indicators
  - Completion celebrations
  - Topic-based learning paths
  - Knowledge reinforcement through repetition

### 💼 Investment Opportunity Curation
**AI-powered investment suggestions based on real market data.**

- **Real-Time Market Data**: Powered by Alpha Vantage API
  - Live stock prices and ETF quotes
  - Daily change percentages
  - Market trends and top gainers

- **Curated Investment Opportunities**:
  - **ETFs**: SPY (S&P 500), VTI (Total Stock Market), VEA (International), BND (Bonds), VNQ (Real Estate)
  - **Major Stocks**: Apple, Microsoft, Alphabet, and more
  - **Risk Assessment**: Low, Medium, Medium-High risk classifications
  - **Minimum Investment**: Shows accessible entry points ($1+)

- **Smart Filtering**:
  - Filters by investment type (ETF, Stock, Bond, REIT)
  - Sorted by performance and risk level
  - Educational descriptions for each opportunity
  - Sector information and market insights

- **Safety Features**:
  - ModerationMetric ensures no high-risk suggestions
  - Educational disclaimers
  - Encourages consultation with financial advisors
  - Past performance disclaimers

### 🔄 Agent Optimization (Opik Agent Optimizer)
**Continuously improving prompts.**

- **Prompt Tuning**: System prompts optimized for "supportive but firm" tone
- **A/B Testing**: Different prompt variations tested
- **Performance Tracking**: Completion rates, user satisfaction
- **Auto-Improvement**: Prompts refined based on real user interactions

---

## 🔍 Opik Integration (Deep)

WiseSpend showcases **production-grade Opik integration** with comprehensive tracing, evaluation, and optimization.

**Opik integration — files for reviewers (traverse here):**

| File | Role |
|------|------|
| `backend/src/infrastructure/services/OpikService.ts` | Core Opik client: init, `createTrace()`, `flush()`, env config (OPIK_API_KEY, OPIK_PROJECT_NAME, OPIK_WORKSPACE) |
| `backend/src/infrastructure/services/GoogleGenAIService.ts` | Traces for **chat** and **receipt analysis** reasoning chain; creates spans (e.g. `analyze-receipt-image`, chat trace), logs token usage and errors |
| `backend/src/application/use-cases/FinancialAssistantChatUseCase.ts` | Trace `financial-assistant-chat` for AI Coach (and Grow panel) conversations |
| `backend/src/application/use-cases/GenerateQuizzesUseCase.ts` | Trace `generate-personalized-quizzes` for Grow Knowledge tab quiz generation |
| `backend/src/infrastructure/services/QuizCuratorAgent.ts` | Nested trace `generate-quiz-for-concept`; flat input/output for Opik LLM-as-a-Judge |
| `backend/src/infrastructure/services/QuizEvaluator.ts` | Trace `quiz-llm-judge-evaluation`; LLM-as-a-Judge evaluation of quiz content (when EVALUATE_QUIZZES=true) |
| `backend/src/index.ts` | Graceful shutdown: calls `opikService.flush()` on SIGTERM/SIGINT so traces are sent before exit |

### 📊 Full Tracing Coverage

**Every AI operation is traced:**

| Operation | Trace Name | Spans |
|-----------|------------|-------|
| Chat Conversation | `chat-gemini-2.5-flash` | LLM call, response processing |
| Receipt Analysis | `analyze-receipt-image` | Preprocessing, Vision analysis, Goal impact calculation |

**Trace Structure:**
```typescript
trace: analyze-receipt-image
├── span: preprocess-receipt-image (type: general)
├── span: gemini-multimodal-analysis (type: llm)
│   ├── input: { model, prompt, image, temperature }
│   ├── output: { analysis, fullAnalysis }
│   └── metadata: { usage: { tokens }, provider: "google-genai" }
└── span: calculate-goal-impact (type: general)
    └── input: { analysis }
```

### 🎯 Evaluation Metrics

**Built-in Opik Evaluators:**

- **ModerationMetric**: Ensures no high-risk investment suggestions
- **HallucinationMetric**: Validates financial data accuracy
- **Custom Evaluators**: Strategy alignment, personalization quality

**Evaluation Workflow:**
```
AI Response Generated
        │
        ▼
┌───────────────────────┐
│  Opik Evaluation      │
│  • ModerationMetric    │
│  • HallucinationMetric│
│  • Custom Evaluators  │
└───────────────────────┘
        │
        ▼
┌───────────────────────┐
│  Response Approved    │
│  or Flagged           │
└───────────────────────┘
```

### 🔧 Agent Optimization

**Opik Agent Optimizer Integration:**

- **System Prompt Tuning**: Optimized for "supportive but firm" coaching tone
- **Performance Tracking**: Measures user engagement and goal completion rates
- **Iterative Improvement**: Prompts refined based on real-world performance
- **Regression Testing**: 50+ edge-case scenarios ensure stability

### 📈 Observability Features

- **Token Usage Tracking**: Full cost observability for every LLM call
- **Error Tracking**: All errors captured with full context
- **Performance Metrics**: Response times, success rates
- **User Journey Mapping**: Complete trace of user interactions

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Google Cloud account (for Gemini API)
- Comet account (for Opik)

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your keys:
# - GEMINI_API_KEY (from Google Cloud)
# - OPIK_API_KEY (from Comet)
# - OPIK_PROJECT_NAME (e.g., "WiseSpend-Evals")
# - OPIK_WORKSPACE (your Comet workspace)
# - MONGODB_URI (your MongoDB connection string)
# - CLOUDINARY_* (for receipt image storage)

# Start development server
npm run dev
```

Backend runs on `http://localhost:8000`

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your keys:
# - NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
# - GOOGLE_CLIENT_ID (for OAuth)
# - GOOGLE_CLIENT_SECRET (for OAuth)
# - NEXTAUTH_SECRET (generate with: openssl rand -base64 32)
# - NEXTAUTH_URL=http://localhost:3000

# Start development server
npm run dev
```

Frontend runs on `http://localhost:3000`

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api/v1
- **Opik Dashboard**: https://www.comet.com/opik

---

## 🎬 Demo Scenarios

### Scenario 1: First Receipt Scan

1. **User uploads coffee receipt** → Gemini analyzes image
2. **System extracts**: "Coffee - $6.50"
3. **Goal impact calculated**: "That's 15 minutes of your retirement fund"
4. **Socratic question**: "Is this worth delaying your house deposit by 2 weeks?"
5. **Full trace in Opik**: See the complete reasoning chain

### Scenario 2: Pattern Recognition

1. **User scans 5 receipts** → System identifies pattern
2. **Insight generated**: "You spend 15% more on coffee when stressed"
3. **Coaching question**: "Noticed a spike in convenience food spending. What's driving this?"
4. **User reflects** → Makes informed choice next time

### Scenario 3: Goal Achievement

1. **User sets goal**: "Save $10,000 for house deposit"
2. **Scans receipts** → Each purchase shows impact
3. **Visual progress**: "You're 2 weeks closer to your goal!"
4. **Motivation**: Seeing real progress encourages continued saving

### Scenario 4: Grow Page — Knowledge + Quiz

1. **User opens Grow** (sidebar) → Defaults to **Knowledge** tab
2. **Sees financial literacy cards** → 12 topics (50/30/20, compound growth, emergency fund, etc.)
3. **Clicks a topic** → **Generate quiz** → AI returns 5 multiple-choice questions
4. **Completes quiz** → Sees score and explanations; can generate a new quiz anytime

### Scenario 5: Grow Page — Investment Discovery

1. **User opens Grow** → Switches to **Investment Suggestions** tab
2. **Sees curated opportunities** → ETFs (SPY, VTI, VEA, BND, VNQ), stocks; real-time prices (Alpha Vantage)
3. **Filters by type** → ETF, Stock, Bond, REIT; reviews risk levels and descriptions
4. **Uses side AI panel** → Asks follow-up questions about a ticker or concept
5. **Makes informed decision** → With full context and disclaimers

---

## 📋 Evaluation Summary

| Criteria | Implementation |
|----------|----------------|
| ✅ **True Agent** | Autonomous reasoning chain: Receipt → Analysis → Goal Impact → Coaching |
| ⭐ **Deep Opik Integration** | **Every AI call traced with nested spans, full observability** |
| ✅ **Evaluation-Driven** | ModerationMetric, HallucinationMetric, custom evaluators |
| ✅ **Agent Optimization** | Opik Agent Optimizer tunes prompts for optimal coaching tone |
| ✅ **Production Ready** | Error handling, graceful shutdown, comprehensive logging |
| ✅ **Novel Use Case** | Multimodal receipt analysis with goal impact calculation |
| ✅ **User Value** | Transforms "financial fog" into actionable insights |
| ✅ **Gamified Learning** | 🎓 Interactive financial literacy quizzes (12 topics) |
| ✅ **Investment Curation** | 💼 Real-time investment opportunities with market data |
| ✅ **Full Stack** | Next.js frontend, Express backend, MongoDB, Cloudinary |
| ✅ **Authentication** | Google OAuth via NextAuth, protected routes |

---

## 📁 Key Files

```
backend/
├── src/
│   ├── infrastructure/
│   │   └── services/
│   │       ├── GoogleGenAIService.ts    # 🤖 Gemini integration with Opik tracing
│   │       └── OpikService.ts           # 🔍 Opik client wrapper
│   ├── application/
│   │   └── use-cases/
│   │       ├── AnalyzeReceiptUseCase.ts  # 📸 Receipt analysis logic
│   │       ├── ChatUseCase.ts            # 💬 Socratic coaching
│   │       └── ComputeWiseScoreUseCase.ts # 📊 Financial resilience score
│   └── presentation/
│       └── controllers/
│           ├── ReceiptController.ts      # Receipt upload & analysis
│           └── AIController.ts           # AI chat endpoints
│
frontend/
├── app/
│   ├── dashboard/
│   │   ├── page.tsx                     # 📊 Main dashboard
│   │   ├── transactions/page.tsx        # 📝 Transaction history
│   │   ├── analytics/page.tsx           # 📈 Spending analytics
│   │   ├── goals/page.tsx               # 🎯 Financial goals
│   │   ├── grow/page.tsx                # 🌱 Grow page — Knowledge tab (literacy + AI quizzes) + Investment Suggestions tab
│   │   └── ai-coach/page.tsx            # 🤔 Socratic coach chat
│   └── scan/page.tsx                    # 📸 Receipt scanning
├── components/
│   ├── dashboard/
│   │   ├── FinancialSummaryCards.tsx   # Summary cards
│   │   ├── SocraticCoach.tsx            # Coach insights
│   │   ├── TransactionList.tsx          # Recent transactions
│   │   ├── FinancialLiteracyCards.tsx   # 🎓 Gamified learning cards
│   │   ├── QuizModal.tsx                # 📝 Interactive quiz component
│   │   ├── InvestmentSuggestions.tsx    # 💼 Investment opportunities
│   │   └── FinancialInsights.tsx        # 💡 AI-generated insights
│   └── receipt/
│       └── AnalysisResultModal.tsx      # Receipt analysis results
└── services/
    ├── receiptService.ts                 # Receipt API calls
    ├── aiService.ts                      # AI chat API calls
    └── investmentService.ts              # 💼 Investment data (Alpha Vantage)
```

---

## 🔧 Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **NextAuth** - Authentication
- **Framer Motion** - Animations

### Backend
- **Express.js** - REST API server
- **TypeScript** - Type safety
- **MongoDB** - Database (via Mongoose)
- **Cloudinary** - Receipt image storage

### AI & Observability
- **Google Gemini 2.5 Flash** - Multimodal AI (vision + text)
- **Opik** - Full observability and evaluation
- **Opik Agent Optimizer** - Prompt optimization

---

## 📊 Opik Dashboard

**View your traces:**

1. Go to https://www.comet.com/opik
2. Navigate to your workspace
3. Open project: `WiseSpend-Evals` (or your configured project)
4. See traces:
   - `chat-gemini-2.5-flash` - Chat conversations
   - `analyze-receipt-image` - Receipt analysis (with nested spans)

**Trace Details:**
- Click any trace to see:
  - Full input/output
  - Nested spans (preprocessing → analysis → goal impact)
  - Token usage
  - Timing information
  - Error logs (if any)

---

## 🧪 Testing Opik Integration

### Test Receipt Analysis

```bash
# Start backend
cd backend && npm run dev

# In another terminal, test receipt analysis
curl -X POST http://localhost:8000/api/v1/ai/receipt/analyze \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "image=@/path/to/receipt.jpg"
```

### Test Chat Endpoint

```bash
curl -X POST http://localhost:8000/api/v1/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "What is the capital of France?"}
    ],
    "temperature": 0.7,
    "maxTokens": 100
  }'
```

### View Traces in Opik

After making API calls:
1. Wait 10-30 seconds (traces are batched)
2. Go to Opik dashboard
3. Refresh and see your traces!

---

## 💡 Philosophy

**"The receipt scan isn't about that ONE purchase — it's about building awareness so your NEXT 100 purchases are different."**

WiseSpend transforms hindsight into foresight. By showing you the real cost of every purchase, you start making informed choices *before* you spend, not after.

---

## 📝 License

Built for the **Comet "Commit to Change" AI Agents Hackathon**

---

## 🙏 Acknowledgments

- **Google Gemini** - Multimodal AI capabilities
- **Comet Opik** - Observability and evaluation platform
- **Comet Team** - Hackathon organizers and support

---

**Built with 💰 for the Comet AI Agents Hackathon**
