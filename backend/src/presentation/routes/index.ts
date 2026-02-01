import { Router } from "express";
import multer from "multer";
import { AIController } from "@presentation/controllers/AIController";
import { AuthController } from "@presentation/controllers/AuthController";
import { ReceiptController } from "@presentation/controllers/ReceiptController";
import { authMiddleware } from "@presentation/middleware/authMiddleware";

const router = Router();
const aiController = new AIController();
const authController = new AuthController();
const receiptController = new ReceiptController();

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

export { router as routes };
