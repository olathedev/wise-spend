import { Router } from "express";
import multer from "multer";
import { AIController } from "@presentation/controllers/AIController";
import { AuthController } from "@presentation/controllers/AuthController";
import { ReceiptController } from "@presentation/controllers/ReceiptController";
import { AnalyticsController } from "@presentation/controllers/AnalyticsController";
import { authMiddleware } from "@presentation/middleware/authMiddleware";

const router = Router();
const aiController = new AIController();
const authController = new AuthController();
const receiptController = new ReceiptController();
const analyticsController = new AnalyticsController();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// Example route - replace with your actual routes
router.get("/", (_req, res) => {
  res.json({ message: "API is working!" });
});

// Auth Routes
router.post("/auth/google", (req, res, next) =>
  authController.authenticateWithGoogle(req, res, next),
);
router.post("/auth/refresh", (req, res, next) =>
  authController.refreshToken(req, res, next),
);
router.put("/auth/onboarding", authMiddleware, (req, res, next) =>
  authController.completeOnboarding(req, res, next),
);
router.get("/auth/me", authMiddleware, (req, res, next) =>
  authController.getCurrentUser(req, res, next),
);
router.patch("/auth/profile", authMiddleware, (req, res, next) =>
  authController.updateProfile(req, res, next),
);

// AI Routes
router.post("/ai/generate", (req, res, next) =>
  aiController.generateText(req, res, next),
);
router.post("/ai/chat", (req, res, next) => aiController.chat(req, res, next));

// Receipt analysis (image upload + Gemini analysis; requires auth)
router.post(
  "/ai/receipt/analyze",
  authMiddleware,
  upload.single("image"),
  (req, res, next) => receiptController.analyzeReceipt(req, res, next),
);
router.get("/ai/expenses", authMiddleware, (req, res, next) =>
  receiptController.listExpenses(req, res, next),
);
router.post("/ai/wise-score", authMiddleware, (req, res, next) =>
  aiController.computeWiseScore(req, res, next),
);
router.post("/ai/financial-tips", authMiddleware, (req, res, next) =>
  aiController.generateFinancialTips(req, res, next),
);
router.post("/ai/goals/socratic-suggestion", authMiddleware, (req, res, next) =>
  aiController.generateSocraticGoalSuggestion(req, res, next),
);
router.post("/ai/financial-literacy-questions", authMiddleware, (req, res, next) =>
  aiController.generateFinancialLiteracyQuestions(req, res, next),
);

// Analytics (auth required)
router.get("/ai/analytics/summary", authMiddleware, (req, res, next) =>
  analyticsController.getSummary(req, res, next),
);
router.get("/ai/analytics/heatmap", authMiddleware, (req, res, next) =>
  analyticsController.getHeatmap(req, res, next),
);
router.get("/ai/analytics/behavioral", authMiddleware, (req, res, next) =>
  analyticsController.getBehavioral(req, res, next),
);

export { router as routes };
