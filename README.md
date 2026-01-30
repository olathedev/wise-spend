
**WiseSpend** is an agentic, AI-first financial coach that transforms "financial fog" into actionable resilience. Using **Gemini 1.5 Pro’s multimodal capabilities** and **Opik’s observability suite**, we’ve built a system that doesn't just track spending—it understands it.


```
 WiseSpend is an AI financial coach that helps you understand the real cost of your spending decisions.

 The receipt scan isn't about that ONE purchase — it's about building awareness so your NEXT 100 purchases are different.

```

---

## 🏗️ Core Technology Stack

### 🧠 The Brain: Google Gemini 1.5 Pro
We leverage the **Gemini API** for its native multimodal processing and massive context window.
- **Vision-to-Vault:** We use Gemini to parse unstructured receipt images. Unlike standard OCR, our agent identifies the *intent* of line items (e.g., distinguishing "necessity" from "luxury").
- **Long-Context Planning:** Gemini maintains the user's entire yearly financial goal history in its context window to provide personalized, non-generic advice.
- **Function Calling:** Our agent uses Gemini's native tool-use to interact with real-time budget calculators and goal-tracking APIs.

### 🔍 The Guardian: Comet Opik (Observability & Eval)
To win the "Best Use of Opik" track, we implemented a rigorous **Evaluation-Driven Development** workflow:
- **Tracing & Debugging:** Every agent reasoning chain is logged via Opik. This allows us to visualize how the agent moves from "Seeing a receipt" to "Calculating goal impact."
- **LLM-as-a-Judge:** We use Opik’s `ModerationMetric` and `HallucinationMetric` to ensure our Socratic Coach never suggests high-risk investments or provides inaccurate balance data.
- **Agent Optimization:** We utilized the **Opik Agent Optimizer** to tune our system prompts, ensuring the coach remains "supportive but firm" rather than overwhelming.
- **Regression Testing:** We maintain a dataset of 50+ "edge-case" financial scenarios in Opik to ensure new code changes don't break the agent's core financial logic.

---

## ✨ Features
- **Multimodal Automation:** Snap a photo, and the agent autonomously categorizes spending.
- **Socratic Coaching:** An agent that asks, *"Is this $100 purchase worth delaying your house deposit by 2 weeks?"*
- **Safety Net Simulator:** Agentic "What-if" reasoning to prepare for emergencies like job loss or medical bills.

---

## 💡 "But I Already Spent the Money — Why Scan Receipts?"

**You're right — the money's already gone. But here's the thing:** most people don't *realize* what they're spending until it's too late. WiseSpend isn't about undoing the past, it's about **pattern recognition for your future self.**

### Here's What Actually Happens:

1. **You scan today's $100 receipt** → WiseSpend shows you: *"That's 2 weeks further from your house deposit"*
   
2. **Next week, you're about to buy something similar** → You remember that gut-punch feeling from last time. You pause. Maybe you still buy it, but now it's a *choice*, not autopilot.

3. **Over time, you start seeing patterns**: *"Oh, I drop $300/month on convenience food when I'm stressed"* or *"I spend way more on subscriptions than I thought."*

**The receipt scan isn't about that ONE purchase — it's about building awareness so your NEXT 100 purchases are different.**

---

### The Psychology: Hindsight → Foresight

Think of it like reviewing game film after a loss. You can't change the score, but you can play better next time.

When you run our **Emergency Simulator** (*"What if I lose my job?"*), you see *exactly* which spending habits would wreck you. That knowledge changes how you spend TODAY.

---

### How WiseSpend Evolves With You:

- **Week 1 (Learning Mode)**: You scan receipts to *discover* your patterns  
- **Week 2 (Awareness Engine)**: The agent starts predicting: *"You usually spend $X on Fridays — planning to stick to your goal this week?"*  
- **Week 3+ (Future-You Coach)**: You actively avoid purchases because you *remember* the trade-off

**You can't change what you don't measure. WiseSpend turns every receipt into a lesson for tomorrow.**

## 🛠️ Implementation Details

### How to Run
1. **Setup Env:**
   ```env
   GOOGLE_API_KEY=your_gemini_key
   OPIK_API_KEY=your_opik_key
   OPIK_PROJECT_NAME="WiseSpend-Evals"