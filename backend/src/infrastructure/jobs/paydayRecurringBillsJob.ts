import cron from "node-cron";
import { UserRepository } from "@infrastructure/repositories/UserRepository";
import { RecurringBillModel } from "@infrastructure/models/RecurringBillModel";
import { UserModel } from "@infrastructure/models/UserModel";
import { Logger } from "@shared/utils/logger";

function startOfDay(d: Date): Date {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function addDays(d: Date, days: number): Date {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function addMonths(d: Date, months: number): Date {
  const copy = new Date(d);
  copy.setMonth(copy.getMonth() + months);
  return copy;
}

function addYears(d: Date, years: number): Date {
  const copy = new Date(d);
  copy.setFullYear(copy.getFullYear() + years);
  return copy;
}

/**
 * Runs daily at 00:05 (server local time).
 * - Updates nextPaydayDate for users when today >= nextPaydayDate
 * - Updates nextDueDate for recurring bills when today >= nextDueDate
 */
export function startPaydayRecurringBillsCron(): void {
  cron.schedule(
    "5 0 * * *",
    async () => {
      Logger.info("Running payday and recurring bills update job");
      const today = startOfDay(new Date());

      try {
        // 1. Update users whose payday has passed
        const userRepo = new UserRepository();
        const users = await userRepo.findAll();
        let paydayUpdates = 0;

        for (const user of users) {
          if (!user.nextPaydayDate || !user.paydayFrequency || !user.id) continue;
          const payday = startOfDay(new Date(user.nextPaydayDate));
          if (payday > today) continue;

          let nextPayday: Date;
          switch (user.paydayFrequency) {
            case "weekly":
              nextPayday = addDays(payday, 7);
              break;
            case "biweekly":
              nextPayday = addDays(payday, 14);
              break;
            case "monthly":
              nextPayday = addMonths(payday, 1);
              break;
            default:
              continue;
          }

          await UserModel.findByIdAndUpdate(user.id, {
            $set: { nextPaydayDate: nextPayday },
          });
          paydayUpdates++;
          Logger.info(`Updated nextPaydayDate for user ${user.id} to ${nextPayday.toISOString()}`);
        }

        // 2. Update recurring bills whose nextDueDate has passed
        const allBills = await RecurringBillModel.find({
          isActive: true,
          nextDueDate: { $lte: today },
        });

        let billUpdates = 0;
        for (const doc of allBills) {
          const currentDue = new Date(doc.nextDueDate);
          let nextDue: Date;
          switch (doc.frequency) {
            case "weekly":
              nextDue = addDays(currentDue, 7);
              break;
            case "monthly":
              nextDue = addMonths(currentDue, 1);
              break;
            case "yearly":
              nextDue = addYears(currentDue, 1);
              break;
            default:
              continue;
          }

          await RecurringBillModel.findByIdAndUpdate(doc._id, {
            $set: { nextDueDate: nextDue },
          });
          billUpdates++;
          Logger.info(
            `Updated nextDueDate for bill ${doc._id} (${doc.name}) to ${nextDue.toISOString()}`,
          );
        }

        Logger.info(
          `Payday/recurring bills job complete: ${paydayUpdates} payday(s), ${billUpdates} bill(s) updated`,
        );
      } catch (error) {
        Logger.error("Payday and recurring bills job failed", error);
      }
    },
    { timezone: "America/New_York" },
  );
  Logger.info("Payday and recurring bills cron scheduled (daily at 00:05 ET)");
}
