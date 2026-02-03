import { Opik } from 'opik';
import { Logger } from '@shared/utils/logger';

/**
 * Opik Service for observability and evaluation
 * Provides tracing, debugging, and evaluation metrics for AI agent workflows
 */
export class OpikService {
  private client: Opik;
  private isEnabled: boolean;

  constructor() {
    const apiKey = process.env.OPIK_API_KEY;
    const projectName = process.env.OPIK_PROJECT_NAME || 'WiseSpend-Evals';
    // Support both OPIK_WORKSPACE and OPIK_WORKSPACE_NAME for compatibility
    const workspaceName = process.env.OPIK_WORKSPACE_NAME || process.env.OPIK_WORKSPACE;
    const apiUrl = process.env.OPIK_URL_OVERRIDE || 'https://www.comet.com/opik/api';

    this.isEnabled = !!apiKey;

    if (!this.isEnabled) {
      Logger.warn('Opik is not configured. Set OPIK_API_KEY to enable observability.');
      // Create a no-op client
      this.client = new Opik({
        projectName,
        apiKey: '',
      });
      return;
    }

    try {
      // Build config object conditionally
      const opikConfig: any = {
        apiKey,
        projectName,
      };

      // Only add optional fields if they exist
      if (apiUrl) {
        opikConfig.apiUrl = apiUrl;
      }
      if (workspaceName) {
        opikConfig.workspaceName = workspaceName;
      }

      this.client = new Opik(opikConfig);
      Logger.info('Opik service initialized', { 
        projectName, 
        workspaceName: workspaceName || 'not set',
        apiUrl 
      });
    } catch (error) {
      // Better error logging
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;
      Logger.error('Failed to initialize Opik service', {
        message: errorMessage,
        stack: errorStack,
        config: {
          hasApiKey: !!apiKey,
          projectName,
          workspaceName: workspaceName || 'not set',
          apiUrl,
        },
      });
      this.isEnabled = false;
      // Create a no-op client as fallback
      this.client = new Opik({
        projectName,
        apiKey: '',
      });
    }
  }

  /**
   * Create a trace for an agent operation
   * @param name - Name of the trace
   * @param input - Input data for the trace
   * @param metadata - Additional metadata
   * @returns Opik trace object
   */
  createTrace(name: string, input?: Record<string, any>, metadata?: Record<string, any>) {
    if (!this.isEnabled) {
      // Return a no-op trace object
      return {
        span: () => ({
          end: () => {},
          update: () => {},
        }),
        end: () => {},
        update: () => {},
      };
    }

    try {
      const trace = this.client.trace({
        name,
        input: input || {},
        metadata: metadata || {},
      });
      return trace;
    } catch (error) {
      Logger.error('Failed to create Opik trace', error);
      return {
        span: () => ({
          end: () => {},
          update: () => {},
        }),
        end: () => {},
        update: () => {},
      };
    }
  }

  /**
   * Flush all pending traces to Opik
   * Call this before application shutdown or in short-lived scripts
   */
  async flush(): Promise<void> {
    if (!this.isEnabled) {
      return;
    }

    try {
      await this.client.flush();
      Logger.debug('Opik traces flushed successfully');
    } catch (error) {
      Logger.error('Failed to flush Opik traces', error);
    }
  }

  /**
   * Check if Opik is enabled
   */
  get enabled(): boolean {
    return this.isEnabled;
  }

  /**
   * Get the underlying Opik client (for advanced usage)
   */
  getClient(): Opik {
    return this.client;
  }
}

// Singleton instance
let opikServiceInstance: OpikService | null = null;

/**
 * Initialize and get the Opik service instance
 */
export const getOpikService = (): OpikService => {
  if (!opikServiceInstance) {
    opikServiceInstance = new OpikService();
  }
  return opikServiceInstance;
};
