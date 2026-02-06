import cron from "node-cron";
import { CommitmentRepository } from "@infrastructure/repositories/CommitmentRepository";
import { CommitmentModel } from "@infrastructure/models/CommitmentModel";
import { Logger } from "@shared/utils/logger";

/**
 * Runs every Wednesday at 6:00 PM (server local time).
 * Marks active commitments with midWeekReminderSentAt so the app can prompt mid-week check-in.
 */
export function startMidWeekReminderCron(): void {
  cron.schedule(
    "0 18 * * 3",
    async () => {
      Logger.info("Running mid-week commitment reminder job");
      try {
        const repo = new CommitmentRepository();
        const commitments = await repo.findActiveForMidWeekReminder();
        if (commitments.length === 0) {
          Logger.info("No active commitments needing mid-week reminder");
          return;
        }

        const now = new Date();
        for (const c of commitments) {
          if (c.id) {
            await CommitmentModel.findByIdAndUpdate(c.id, {
              $set: { midWeekReminderSentAt: now },
            });
            Logger.info(`Sent mid-week reminder for commitment ${c.id} (user ${c.userId})`);
          }
        }
        Logger.info(`Marked ${commitments.length} commitment(s) for mid-week check-in`);
      } catch (error) {
        Logger.error("Mid-week reminder job failed", error);
      }
    },
    { timezone: "America/New_York" },
  );
  Logger.info("Mid-week reminder cron scheduled (Wed 6pm ET)");
}
