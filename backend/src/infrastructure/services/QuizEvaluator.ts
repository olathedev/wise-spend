import { Quiz } from '@domain/entities/Quiz';
import { QuizQuestion } from '@domain/entities/QuizQuestion';
import { IAIService } from '@domain/interfaces/IAIService';
import { getOpikService } from './OpikService';
import { Logger } from '@shared/utils/logger';

export interface QuizEvaluationResult {
  overallScore: number; // 0-1 (percentage as decimal)
  questionScores: Array<{
    questionIndex: number;
    question: string;
    score: number; // 0-1
    reasoning: string;
  }>;
  evaluation: {
    relevance: number; // 0-1
    clarity: number; // 0-1
    correctness: number; // 0-1
    personalization: number; // 0-1
  };
}

/**
 * Quiz Evaluator using LLM-as-a-Judge
 * Evaluates quiz quality using an LLM judge to assess:
 * - Relevance to the financial concept
 * - Clarity and understandability
 * - Correctness of answers
 * - Personalization to user's data
 */
export class QuizEvaluator {
  constructor(private aiService: IAIService) {}

  /**
   * Evaluate a quiz using LLM-as-a-Judge
   */
  async evaluateQuiz(
    quiz: Quiz,
    concept: string,
    userContext?: {
      monthlyIncome?: number;
      monthlySpending: number;
      goals?: string[];
    },
  ): Promise<QuizEvaluationResult> {
    const opikService = getOpikService();
    
    // Create Opik trace for evaluation
    const evalTrace = opikService.createTrace('quiz-llm-judge-evaluation', {
      quizId: quiz.id,
      concept,
      questionCount: quiz.questions.length,
    }, {
      operation: 'quiz-evaluation',
      evaluationType: 'llm-as-judge',
    });

    try {
      // Evaluate each question
      const questionEvaluations = await Promise.all(
        quiz.questions.map((question, index) =>
          this.evaluateQuestion(question, concept, index, userContext, evalTrace),
        ),
      );

      // Calculate overall scores
      const questionScores = questionEvaluations.map((e) => e.score);
      const overallScore =
        questionScores.reduce((sum, score) => sum + score, 0) /
        questionScores.length;

      const relevance =
        questionEvaluations.reduce((sum, e) => sum + e.relevance, 0) /
        questionEvaluations.length;
      const clarity =
        questionEvaluations.reduce((sum, e) => sum + e.clarity, 0) /
        questionEvaluations.length;
      const correctness =
        questionEvaluations.reduce((sum, e) => sum + e.correctness, 0) /
        questionEvaluations.length;
      const personalization =
        questionEvaluations.reduce((sum, e) => sum + e.personalization, 0) /
        questionEvaluations.length;

      const result: QuizEvaluationResult = {
        overallScore,
        questionScores: questionEvaluations.map((e, idx) => ({
          questionIndex: idx,
          question: quiz.questions[idx].question,
          score: e.score,
          reasoning: e.reasoning,
        })),
        evaluation: {
          relevance,
          clarity,
          correctness,
          personalization,
        },
      };

      // Update Opik trace with evaluation results
      evalTrace.update({
        output: {
          overallScore,
          evaluation: result.evaluation,
          questionCount: quiz.questions.length,
        },
        metadata: {
          evaluationComplete: true,
          scores: {
            relevance,
            clarity,
            correctness,
            personalization,
          },
        },
      });
      evalTrace.end();

      Logger.info(`Quiz evaluation complete`, {
        quizId: quiz.id,
        concept,
        overallScore,
        evaluation: result.evaluation,
      });

      return result;
    } catch (error) {
      Logger.error('Error evaluating quiz', {
        quizId: quiz.id,
        concept,
        error: error instanceof Error ? error.message : String(error),
      });

      evalTrace.update({
        output: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        metadata: {
          evaluationComplete: false,
          error: true,
        },
      });
      evalTrace.end();

      // Return default scores on error
      return {
        overallScore: 0.5,
        questionScores: quiz.questions.map((q, idx) => ({
          questionIndex: idx,
          question: q.question,
          score: 0.5,
          reasoning: 'Evaluation failed',
        })),
        evaluation: {
          relevance: 0.5,
          clarity: 0.5,
          correctness: 0.5,
          personalization: 0.5,
        },
      };
    }
  }

  /**
   * Evaluate a single question using LLM-as-a-Judge
   */
  private async evaluateQuestion(
    question: QuizQuestion,
    concept: string,
    index: number,
    userContext?: {
      monthlyIncome?: number;
      monthlySpending: number;
      goals?: string[];
    },
    parentTrace?: any,
  ): Promise<{
    score: number;
    relevance: number;
    clarity: number;
    correctness: number;
    personalization: number;
    reasoning: string;
  }> {
    const opikService = getOpikService();
    
    // Create span for question evaluation
    const questionSpan = parentTrace
      ? parentTrace.span({
          name: `evaluate-question-${index + 1}`,
          type: 'general',
          input: {
            question: question.question.substring(0, 100),
            concept,
            questionIndex: index,
          },
        })
      : null;

    const judgePrompt = this.buildJudgePrompt(question, concept, userContext);

    try {
      // Use LLM-as-a-Judge to evaluate the question
      const judgeResponse = await this.aiService.generateText(judgePrompt, {
        temperature: 0.3, // Low temperature for consistent evaluation
        maxTokens: 500,
      });

      // Parse judge response
      const evaluation = this.parseJudgeResponse(judgeResponse);

      if (questionSpan) {
        questionSpan.update({
          output: {
            score: evaluation.score,
            reasoning: evaluation.reasoning,
            metrics: {
              relevance: evaluation.relevance,
              clarity: evaluation.clarity,
              correctness: evaluation.correctness,
              personalization: evaluation.personalization,
            },
          },
        });
        questionSpan.end();
      }

      return evaluation;
    } catch (error) {
      Logger.error(`Error evaluating question ${index + 1}`, {
        error: error instanceof Error ? error.message : String(error),
      });

      if (questionSpan) {
        questionSpan.update({
          output: {
            error: error instanceof Error ? error.message : 'Unknown error',
            score: 0.5, // Default score
          },
        });
        questionSpan.end();
      }

      // Return default evaluation on error
      return {
        score: 0.5,
        relevance: 0.5,
        clarity: 0.5,
        correctness: 0.5,
        personalization: 0.5,
        reasoning: 'Evaluation failed - using default score',
      };
    }
  }

  /**
   * Build LLM-as-a-Judge prompt for evaluating a question
   */
  private buildJudgePrompt(
    question: QuizQuestion,
    concept: string,
    userContext?: {
      monthlyIncome?: number;
      monthlySpending: number;
      goals?: string[];
    },
  ): string {
    const userContextStr = userContext
      ? `User Context: Income $${userContext.monthlyIncome?.toLocaleString() || 'N/A'}, Spending $${userContext.monthlySpending.toLocaleString()}, Goals: ${userContext.goals?.join(', ') || 'None'}`
      : 'No user context available';

    return `You are an impartial AI judge evaluating a financial education quiz question.

CONCEPT: ${concept}
${userContextStr}

QUESTION TO EVALUATE:
"${question.question}"

OPTIONS:
${question.options.map((opt, idx) => `${idx}. ${opt}`).join('\n')}

CORRECT ANSWER: Option ${question.correctAnswer} - "${question.options[question.correctAnswer]}"

EXPLANATION PROVIDED:
"${question.explanation}"

EVALUATION CRITERIA:
1. **Relevance** (0-1): Does the question directly relate to ${concept}?
2. **Clarity** (0-1): Is the question clear and easy to understand?
3. **Correctness** (0-1): Is the correct answer actually correct? Are options reasonable?
4. **Personalization** (0-1): Does it reference user's data appropriately (if applicable)?

OUTPUT FORMAT (JSON only):
{
  "score": 0.85,
  "relevance": 0.9,
  "clarity": 0.8,
  "correctness": 1.0,
  "personalization": 0.7,
  "reasoning": "Brief explanation of scores (1-2 sentences)"
}

Return ONLY valid JSON, no markdown or extra text.`;
  }

  /**
   * Parse LLM judge response
   */
  private parseJudgeResponse(response: string): {
    score: number;
    relevance: number;
    clarity: number;
    correctness: number;
    personalization: number;
    reasoning: string;
  } {
    try {
      // Extract JSON from response
      let jsonStr = response.trim();
      if (jsonStr.includes('```json')) {
        const match = jsonStr.match(/```json\s*([\s\S]*?)\s*```/);
        if (match) jsonStr = match[1].trim();
      } else if (jsonStr.includes('```')) {
        const match = jsonStr.match(/```\s*([\s\S]*?)\s*```/);
        if (match) jsonStr = match[1].trim();
      }

      // Find JSON object
      if (!jsonStr.startsWith('{')) {
        const match = jsonStr.match(/\{[\s\S]*\}/);
        if (match) jsonStr = match[0];
      }

      const parsed = JSON.parse(jsonStr);

      return {
        score: typeof parsed.score === 'number' ? parsed.score : 0.5,
        relevance: typeof parsed.relevance === 'number' ? parsed.relevance : 0.5,
        clarity: typeof parsed.clarity === 'number' ? parsed.clarity : 0.5,
        correctness:
          typeof parsed.correctness === 'number' ? parsed.correctness : 0.5,
        personalization:
          typeof parsed.personalization === 'number' ? parsed.personalization : 0.5,
        reasoning:
          typeof parsed.reasoning === 'string'
            ? parsed.reasoning
            : 'No reasoning provided',
      };
    } catch (error) {
      Logger.error('Error parsing judge response', {
        error: error instanceof Error ? error.message : String(error),
        responsePreview: response.substring(0, 200),
      });

      // Return default scores
      return {
        score: 0.5,
        relevance: 0.5,
        clarity: 0.5,
        correctness: 0.5,
        personalization: 0.5,
        reasoning: 'Failed to parse judge response',
      };
    }
  }
}
