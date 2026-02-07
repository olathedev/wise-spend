# Opik LLM-as-a-Judge Setup Guide

This guide explains how to set up LLM-as-a-Judge evaluation rules in your Opik dashboard to automatically evaluate quiz quality.

## What is LLM-as-a-Judge?

LLM-as-a-Judge uses a language model to automatically score AI outputs based on custom natural language criteria. In your case, it will evaluate:
- **Relevance**: Does the quiz question relate to the financial concept?
- **Clarity**: Is the question clear and understandable?
- **Correctness**: Is the correct answer actually correct?
- **Personalization**: Does it reference user's data appropriately?

## Step-by-Step Dashboard Setup

### 1. Navigate to Evaluation Rules

1. Log into your [Opik Dashboard](https://www.comet.com/opik)
2. Go to **Evaluation** → **Rules** (or **Evaluation Rules**)
3. Click **Create Rule** or **New Rule**

### 2. Basic Configuration

Fill in the basic information:

- **Name**: `Quiz Quality Evaluation`
- **Projects**: Select your project (e.g., `WiseSpend-Evals` or your `OPIK_PROJECT_NAME`)
- **Default Project**: Same as above
- **Scope**: Select **Trace** (this evaluates individual quiz generation traces)
- **Enable rule**: ✅ Check this box

### 3. Evaluation Type

- **Type**: Select **LLM-as-Judge**
- **Model**: Select your LLM model (e.g., `gemini-2.5-flash` or `gpt-4o`)

### 4. Judge Prompt

Copy and paste this prompt into the **Prompt** field:

```
You are an impartial AI judge evaluating a financial education quiz question.

CONCEPT: {{input.concept}}

USER CONTEXT:
- Monthly Income: ${{input.userContext.monthlyIncome}}
- Monthly Spending: ${{input.userContext.monthlySpending}}
- Goals: {{input.userContext.goals}}

QUESTION TO EVALUATE:
{{output.quiz.questions[0].question}}

OPTIONS:
{{#each output.quiz.questions[0].options}}
- {{this}}
{{/each}}

CORRECT ANSWER: Option {{output.quiz.questions[0].correctAnswer}} - "{{output.quiz.questions[0].options.[output.quiz.questions[0].correctAnswer]}}"

EXPLANATION PROVIDED:
"{{output.quiz.questions[0].explanation}}"

EVALUATION CRITERIA:
1. **Relevance** (0-1): Does the question directly relate to {{input.concept}}?
2. **Clarity** (0-1): Is the question clear and easy to understand?
3. **Correctness** (0-1): Is the correct answer actually correct? Are options reasonable?
4. **Personalization** (0-1): Does it reference user's data appropriately (if applicable)?

TASK:
Evaluate if the assistant's quiz question effectively addresses the user's financial education needs for the concept "{{input.concept}}".

Consider:
- Accuracy: Is the information correct?
- Completeness: Does it cover the concept adequately?
- Relevance: Does it match the user's financial situation?

Provide a binary score (true/false) indicating whether this quiz question effectively addresses the user's input, and explain your reasoning in one clear sentence.
```

**Note**: If your Opik dashboard uses a different template syntax (like `{{input}}` instead of Handlebars), adjust accordingly. The key variables are:
- `{{input.concept}}` - The financial concept
- `{{input.userContext}}` - User's financial data
- `{{output.quiz}}` - The generated quiz

### 5. Variable Mapping

Opik detects variables in your prompt (e.g. `{{input.concept}}`, `{{output.quiz.questions[0].question}}`) and shows a **"Select a key from recent trace"** dropdown for each.

**Important:** The dropdown is filled from **recent traces**. You may see generic LLM fields like `input.maxTokens`, `input.messages`, `input.model`, `input.temperature` — those come from the underlying GenAI call traces. Our quiz traces use different fields.

**To get the quiz fields in the dropdown:**

1. **Generate a quiz first**  
   From your app, trigger “Generate Quizzes” (Grow → Gamified Learning) so at least one `generate-quiz-for-concept` trace is sent to Opik.

2. **Then create or edit the rule**  
   With that quiz trace in “recent traces”, the dropdown may show:
   - **input**: `input` (whole object) or `input.concept`, `input.userContext`, `input.promptPreview`
   - **output**: `output` or `output.quiz`, `output.quiz.questions[0].question`, `output.quiz.questions[0].options`, `output.quiz.questions[0].correctAnswer`, `output.quiz.questions[0].explanation`

3. **Map each variable** to the matching key:
   - `input.concept` → select **`input.concept`** (or type it if the UI allows)
   - `output.quiz.questions[0].question` → **`output.quiz.questions[0].question`**
   - `output.quiz.questions[0].options` → **`output.quiz.questions[0].options`**
   - `output.quiz.questions[0].correctAnswer` → **`output.quiz.questions[0].correctAnswer`**
   - `output.quiz.questions[0].explanation` → **`output.quiz.questions[0].explanation`**
   - `input.userContext` → **`input.userContext`** (or use the nested fields if that’s what’s available)

If your UI only lists the generic LLM keys, try filtering or selecting trace type/name so it uses traces named **`generate-quiz-for-concept`**; then the quiz keys above should appear. If the mapper allows **custom/free-text keys**, enter the paths above exactly (e.g. `input.concept`, `output.quiz.questions[0].question`).

### 6. Score Definition

Click **Add score** and configure:

- **Name**: `Correctness`
- **Type**: **Boolean** (true/false)
- **Description**: `Whether the quiz question effectively addresses the user's financial education needs`

### 7. Filtering & Sampling (Optional)

- **Filter**: You can filter traces by:
  - `metadata.operation = "quiz-generation"`
  - `metadata.concept` (specific concepts)
  - `metadata.success = true` (only successful generations)
  
- **Sampling**: 
  - **100%** - Evaluate all traces (recommended for testing)
  - **10-50%** - Sample for production (reduces costs)

### 8. Save and Enable

1. Click **Save** or **Create Rule**
2. Ensure **Enable rule** is checked
3. The rule will now automatically evaluate all new quiz generation traces

## How It Works

### Trace Structure

When quizzes are generated, traces are created with this structure:

```json
{
  "input": {
    "concept": "Budgeting Basics",
    "userContext": {
      "name": "John Doe",
      "monthlyIncome": 5000,
      "monthlySpending": 3500,
      "goals": ["Save for vacation", "Pay off debt"]
    },
    "promptPreview": "..."
  },
  "output": {
    "quiz": {
      "title": "Budgeting Basics Quiz",
      "description": "Test your budgeting knowledge",
      "concept": "Budgeting Basics",
      "questionCount": 5,
      "questions": [
        {
          "question": "What percentage of income should go to savings?",
          "options": ["10%", "20%", "30%", "40%"],
          "correctAnswer": 1,
          "explanation": "The 20% rule is a common guideline..."
        }
      ]
    },
    "rawResponse": "..."
  },
  "metadata": {
    "operation": "quiz-generation",
    "concept": "Budgeting Basics",
    "provider": "google-genai",
    "success": true
  }
}
```

### Evaluation Flow

1. **Quiz Generation**: `QuizCuratorAgent.generateQuizForConcept()` creates a trace with `input` and `output`
2. **Automatic Evaluation**: Opik dashboard rule picks up the trace
3. **LLM Judge**: The judge prompt evaluates the quiz quality
4. **Score Assignment**: Boolean score (true/false) is assigned
5. **Dashboard View**: Scores appear in Opik dashboard for monitoring

## Viewing Results

### In Opik Dashboard

1. Go to **Evaluation** → **Results** or **Traces**
2. Filter by:
   - Rule name: `Quiz Quality Evaluation`
   - Trace name: `generate-quiz-for-concept`
3. View:
   - Individual scores for each quiz
   - Average scores over time
   - Score distribution
   - Failed evaluations

### Metrics to Monitor

- **Pass Rate**: % of quizzes scoring `true`
- **Average Score**: Overall quality metric
- **Trends**: Are scores improving over time?
- **Concept Performance**: Which concepts generate better quizzes?

## Troubleshooting

### No Traces Appearing

1. Check `OPIK_API_KEY` is set in `.env`
2. Verify `OPIK_PROJECT_NAME` matches dashboard project
3. Ensure traces are being flushed: `await opikService.flush()`
4. Check backend logs for Opik errors

### Evaluation Not Running

1. Verify rule is **enabled**
2. Check rule **scope** matches trace type (`Trace`)
3. Verify **filter** isn't excluding your traces
4. Check trace structure matches variable mappings

### Incorrect Variable Mapping / Dropdown shows wrong fields

1. **Generate a quiz first** so a `generate-quiz-for-concept` trace exists; the variable dropdown is built from recent traces.
2. In Opik, open **Traces**, find a trace named **`generate-quiz-for-concept`**, and confirm it has:
   - `input.concept`, `input.userContext`, `input.promptPreview`
   - `output.quiz` with `questions[0].question`, `questions[0].options`, `questions[0].correctAnswer`, `questions[0].explanation`
3. When mapping, filter or select trace type so the rule uses **quiz** traces (not the generic LLM call traces that show `input.messages`, `input.maxTokens`, etc.).
4. If the UI allows typing the key path, use: `input.concept`, `output.quiz.questions[0].question`, etc.

## Advanced Configuration

### Multiple Evaluation Rules

You can create separate rules for:
- **Question Quality**: Evaluate individual questions
- **Quiz Completeness**: Check if all 5 questions are present
- **Personalization**: Score how well quizzes match user data

### Custom Scoring

Instead of Boolean, you can use:
- **Numeric** (0-1): More granular scoring
- **Categorical**: "Excellent", "Good", "Fair", "Poor"
- **Multi-dimensional**: Separate scores for each criterion

### Automated Alerts

Set up alerts in Opik for:
- Score drops below threshold (e.g., < 0.7)
- High failure rate (> 20%)
- Specific concepts underperforming

## Example Evaluation Rule JSON

If your Opik dashboard supports JSON import, here's an example structure:

```json
{
  "name": "Quiz Quality Evaluation",
  "type": "llm-as-judge",
  "scope": "trace",
  "enabled": true,
  "model": "gemini-2.5-flash",
  "prompt": "...",
  "variableMapping": {
    "input": "input",
    "output": "output"
  },
  "scoreDefinition": {
    "name": "Correctness",
    "type": "boolean",
    "description": "Whether quiz effectively addresses user needs"
  },
  "filter": {
    "metadata.operation": "quiz-generation"
  }
}
```

## Next Steps

1. ✅ Set up the evaluation rule in Opik dashboard
2. ✅ Generate some quizzes from your app
3. ✅ Verify traces appear in Opik
4. ✅ Check evaluation scores
5. ✅ Monitor and iterate on prompt/rule

## Support

- [Opik Documentation](https://opik.docs.buildwithfern.com/)
- [Opik Evaluation Guide](https://opik.docs.buildwithfern.com/docs/opik/reference/typescript-sdk/evaluation/overview)
- Check backend logs for detailed trace information
