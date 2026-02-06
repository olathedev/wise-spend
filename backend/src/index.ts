import "dotenv/config";
import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import { errorHandler } from "@presentation/middleware/errorHandler";
import { routes } from "@presentation/routes";
import { initializeAIService, getOpikService } from "@infrastructure/services";
import { initializeDatabase } from "@infrastructure/database";
import { startMidWeekReminderCron } from "@infrastructure/jobs/midWeekReminderJob";
import { startPaydayRecurringBillsCron } from "@infrastructure/jobs/paydayRecurringBillsJob";
import { Logger } from "@shared/utils/logger";

const app: Express = express();
const PORT = process.env.PORT || 3000;

const initializeServices = async () => {
  await initializeDatabase();
  Logger.info("Database initialized successfully");

  try {
    initializeAIService();
    Logger.info("AI service initialized successfully");
  } catch (error) {
    Logger.warn("AI service initialization failed", error);
    Logger.warn("Agentic features will not be available");
  }

  startMidWeekReminderCron();
  startPaydayRecurringBillsCron();
};

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes (mount at /api/v1 to match frontend baseURL)
app.use("/api/v1", routes);

// Health check
app.get("/health", async (_req, res) => {
  const { getDatabase } = await import("@infrastructure/database");

  let dbStatus = "disconnected";
  try {
    const db = getDatabase();
    dbStatus = db.getConnectionStatus() ? "connected" : "disconnected";
  } catch (error) {
    dbStatus = "not initialized";
  }

  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    database: dbStatus,
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Graceful shutdown handler to flush Opik traces
const gracefulShutdown = async (signal: string) => {
  Logger.info(`Received ${signal}, shutting down gracefully...`);
  
  try {
    const opikService = getOpikService();
    if (opikService.enabled) {
      Logger.info("Flushing Opik traces...");
      await opikService.flush();
      Logger.info("Opik traces flushed successfully");
    }
  } catch (error) {
    Logger.error("Error flushing Opik traces during shutdown", error);
  }
  
  process.exit(0);
};

// Register shutdown handlers
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Start server
const startServer = async () => {
  await initializeServices();

  app.listen(PORT, () => {
    Logger.info(`🚀 Server is running on port ${PORT}`);
    Logger.info(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
  });
};

startServer().catch((error) => {
  Logger.error("Failed to start server:", error);
  process.exit(1);
});

export default app;
