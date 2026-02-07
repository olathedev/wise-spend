# Fix: Opik Dropdown Shows Wrong Fields

## Problem

When mapping variables in Opik's LLM-as-a-Judge rule, the dropdown shows:
- `input.maxTokens`
- `input.messages`
- `input.model`
- `input.temperature`
- `metadata.operation`
- `output`

But you need:
- `input.concept`
- `input.userContext`
- `output.quiz.questions[0].question`
- `output.quiz.questions[0].options`
- `output.quiz.questions[0].correctAnswer`

## Why This Happens

Opik's dropdown is populated from **"recent traces"**. The fields you're seeing (`input.maxTokens`, `input.messages`, etc.) come from the **underlying GenAI service traces** (created when `generateText()` calls the LLM), not from our **quiz generation traces** (`generate-quiz-for-concept`).

## Solution

### Option 1: Generate Quiz First (Recommended)

1. **Generate a quiz from your app:**
   - Go to your app → Grow page → Gamified Learning
   - Click "Generate Quizzes"
   - Wait for at least one quiz to be generated

2. **Verify the trace exists in Opik:**
   - Go to Opik Dashboard → **Traces**
   - Look for a trace named **`generate-quiz-for-concept`**
   - Click on it and verify it has:
     - `input.concept`
     - `input.userContext`
     - `output.quiz.questions[0].question`
     - etc.

3. **Create/Edit the evaluation rule:**
   - Now when you map variables, Opik should show the quiz trace fields
   - If it still shows GenAI fields, try **refreshing** or **filtering by trace name**

### Option 2: Filter by Trace Name (If Available)

When creating the evaluation rule, look for a **filter** or **trace selector** option:

- **Filter by trace name**: `generate-quiz-for-concept`
- **Filter by metadata.operation**: `quiz-generation`

This ensures Opik uses your quiz traces, not the GenAI service traces.

### Option 3: Manual Field Entry (If UI Allows)

Some Opik dashboards allow you to **type field paths manually** instead of selecting from dropdown:

1. When mapping `{{input.concept}}`, instead of selecting from dropdown:
   - Type: **`input.concept`**
   - Or try: **`input.concept`** (exact path)

2. For `{{output.quiz.questions[0].question}}`:
   - Type: **`output.quiz.questions[0].question`**

3. For `{{output.quiz.questions[0].options}}`:
   - Type: **`output.quiz.questions[0].options`**

4. For `{{output.quiz.questions[0].correctAnswer}}`:
   - Type: **`output.quiz.questions[0].correctAnswer`**

### Option 4: Use Generic Fields (Workaround)

If manual entry isn't available, you can map to the generic fields and adjust your prompt:

**Map to:**
- `{{input}}` → Select **`input`** (whole object)
- `{{output}}` → Select **`output`** (whole object)

**Then in your prompt, use JSONPath or access nested fields:**
```
CONCEPT: {{input.concept}}
QUESTION: {{output.quiz.questions[0].question}}
```

Opik might still evaluate this correctly if it supports nested field access in prompts.

## Quick Test

1. **Generate a quiz** (creates `generate-quiz-for-concept` trace)
2. **Go to Opik → Traces**
3. **Find trace `generate-quiz-for-concept`**
4. **Inspect its structure** - you should see:
   ```json
   {
     "input": {
       "concept": "Budgeting Basics",
       "userContext": { ... },
       "promptPreview": "..."
     },
     "output": {
       "quiz": {
         "questions": [
           {
             "question": "...",
             "options": [...],
             "correctAnswer": 1,
             "explanation": "..."
           }
         ]
       }
     }
   }
   ```

5. **Create the evaluation rule** - Opik should now show these fields in the dropdown

## Still Not Working?

If the dropdown still shows GenAI fields after generating a quiz:

1. **Check trace name**: Ensure traces are named `generate-quiz-for-concept`
2. **Check trace structure**: Verify `input.concept` exists (not `input.input.concept`)
3. **Clear Opik cache**: Try refreshing or logging out/in
4. **Contact Opik support**: They can help configure trace filtering for rules

## Alternative: Use Metadata Fields

If you can't get the nested fields to work, you could add key data to `metadata`:

```typescript
// In QuizCuratorAgent.ts
const quizTrace = opikService.createTrace('generate-quiz-for-concept', {
  concept,  // This becomes input.concept
  userContext: { ... },
}, {
  operation: 'quiz-generation',
  concept,  // Also in metadata for filtering
  firstQuestion: quizData.questions[0]?.question,  // Add to metadata
});
```

Then map:
- `{{metadata.concept}}` → `metadata.concept`
- `{{metadata.firstQuestion}}` → `metadata.firstQuestion`

But this is less ideal than using the proper `input`/`output` structure.
