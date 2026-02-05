# Financial Assistant API

## Overview

The Financial Assistant provides **personalized Socratic coaching** with full access to the logged-in user's financial data. It uses the user's transaction history, goals, income, and Wise Score to provide contextual, data-driven financial guidance.

## Endpoint

### POST `/api/v1/ai/assistant/chat`

**Description:** Chat with the Financial Assistant (Wise Coach) - a Socratic financial coach that uses your personal financial data.

**Authentication:** Required (Bearer token)

**Request Body:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "How much did I spend this month?"
    }
  ],
  "temperature": 0.7,  // Optional, default: 0.7
  "maxTokens": 2048,   // Optional, default: 2048
  "model": "gemini-2.5-flash"  // Optional
}
```

**Message Format:**
- `role`: `"user"` | `"assistant"` | `"system"` (system messages are auto-added with user context)
- `content`: string (the message text)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "content": "Based on your transaction history, you've spent $1,234.56 this month...",
    "usage": {
      "totalTokens": 450,
      "promptTokens": 320,
      "completionTokens": 130
    },
    "contextUsed": {
      "hasUserData": true,
      "hasTransactions": true,
      "expenseCount": 15
    }
  }
}
```

**Error Responses:**

**401 Unauthorized:**
```json
{
  "success": false,
  "error": {
    "message": "Unauthorized"
  }
}
```

**400 Validation Error:**
```json
{
  "success": false,
  "error": {
    "message": "Messages array is required and must not be empty"
  }
}
```

## Features

### 🎯 Personalized Context

The assistant automatically loads and uses:
- **User Profile**: Name, monthly income, Wise Score, coach personality
- **Financial Goals**: All goals with targets and deadlines
- **Transaction History**: Recent expenses with amounts and categories
- **Spending Patterns**: Monthly spending, category breakdown, averages

### 🤔 Socratic Coaching

The assistant uses Socratic questioning:
- **Instead of**: "You should save more"
- **Asks**: "Have you noticed that your coffee spending is 15% of your monthly income? Is that aligned with your house deposit goal?"

### 📊 Account Queries

Users can ask questions like:
- "How much did I spend this month?"
- "What's my Wise Score and what does it mean?"
- "Show me my top spending categories"
- "How am I doing on my emergency fund goal?"
- "What was my last transaction?"
- "Am I on track to reach my goals?"

### 🎨 Coach Personalities

The assistant adapts to the user's chosen coach personality:
- **drill_sergeant**: Direct and no-nonsense
- **cheerleader**: Encouraging and positive
- **analyst**: Data-focused and analytical
- **balanced**: (default) Balances support with accountability

## Example Usage

### cURL Example

```bash
curl -X POST http://localhost:8000/api/v1/ai/assistant/chat \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "How much did I spend on coffee this month?"
      }
    ]
  }'
```

### Multi-turn Conversation

```bash
# First message
curl -X POST http://localhost:8000/api/v1/ai/assistant/chat \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "What is my Wise Score?"
      }
    ]
  }'

# Follow-up (include previous messages)
curl -X POST http://localhost:8000/api/v1/ai/assistant/chat \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "What is my Wise Score?"
      },
      {
        "role": "assistant",
        "content": "Your Wise Score is 750/1000 (Top 10%)..."
      },
      {
        "role": "user",
        "content": "How can I improve it?"
      }
    ]
  }'
```

## Opik Tracing

Every conversation is fully traced in Opik with:
- **Trace**: `financial-assistant-chat`
- **Spans**:
  - `load-user-context` - Loading user data and transactions
  - `build-system-prompt` - Building context-aware prompt
  - `gemini-assistant-chat` - LLM call with full context

View traces at: https://www.comet.com/opik

## Architecture

```
User Request
    │
    ▼
[Auth Middleware] → Validates JWT, extracts userId
    │
    ▼
[Controller] → Validates request, extracts messages
    │
    ▼
[FinancialAssistantChatUseCase]
    │
    ├──→ [FinancialAssistantAgent]
    │       ├── Load user profile
    │       ├── Load transaction history
    │       ├── Calculate spending patterns
    │       └── Build context-aware system prompt
    │
    └──→ [GoogleGenAIService]
            └── Chat with enriched context
                │
                ▼
            [Opik Tracing]
                └── Full observability
```

## Implementation Details

### FinancialAssistantAgent

Located at: `backend/src/infrastructure/services/FinancialAssistantAgent.ts`

**Responsibilities:**
- Load user financial context
- Calculate spending summaries
- Categorize expenses
- Build personalized system prompts
- Adapt to coach personality

### FinancialAssistantChatUseCase

Located at: `backend/src/application/use-cases/FinancialAssistantChatUseCase.ts`

**Responsibilities:**
- Orchestrate agent and AI service
- Handle Opik tracing
- Enrich messages with user context
- Return response with context metadata

## Testing

### Test with Real User Data

1. **Get JWT Token** (from `/api/v1/auth/google`)
2. **Make Assistant Chat Request**:
   ```bash
   curl -X POST http://localhost:8000/api/v1/ai/assistant/chat \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "messages": [{"role": "user", "content": "Tell me about my spending"}]
     }'
   ```
3. **Check Opik Dashboard** for traces

### Expected Behavior

- ✅ Loads user data automatically
- ✅ References specific transactions
- ✅ Uses user's name in responses
- ✅ Adapts to coach personality
- ✅ Provides data-driven insights
- ✅ Asks Socratic questions
- ✅ Traces everything in Opik
