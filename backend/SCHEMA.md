# MongoDB Schema Reference

This document describes the MongoDB collections and their schemas for the WiseSpend application.

## Collections

### 1. Users Collection

**Model**: `UserModel`  
**Collection Name**: `users`

```typescript
{
  _id: ObjectId,
  email: string (unique, lowercase, trimmed),
  name: string (required),
  picture?: string,
  googleId: string (unique, required),
  isActive: boolean (default: true),
  onboardingCompleted: boolean (default: false),
  monthlyIncome?: number,
  financialGoals?: string[],
  goalTargets?: Map<string, number>,  // goalId -> targetAmount
  coachPersonality?: string,
  wiseScore?: number,
  wiseScoreUpdatedAt?: Date,
  wiseScoreTier?: string,
  primaryGoalId?: string,
  goalDeadlines?: Map<string, string>,
  weeklyCheckInDay?: number (0-6, 0=Sunday),
  lastWeeklyCheckInAt?: Date,
  currentCommitment?: string,
  commitmentCreatedAt?: Date,
  lastAccountabilityCheckInAt?: Date,
  lastCelebratedMilestone?: number,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes**:
- `email` (unique)
- `googleId` (unique)
- `financialGoals`
- `goalTargets`

### 2. Expenses Collection

**Model**: `ExpenseModel`  
**Collection Name**: `expenses`

```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: "User", indexed),
  imageUrl: string (required),
  title: string (required, trimmed),
  aiDescription: string (required),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes**:
- `userId` (indexed)

### 3. APIKeys Collection

**Model**: `APIKeyModel`  
**Collection Name**: `apikeys`

```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: "User", indexed),
  secret: string (required, unique, trimmed),
  name: string (trimmed),
  enabled: boolean (default: true, indexed),
  lastUsedAt?: Date,
  expiresAt?: Date,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes**:
- `userId` (indexed)
- `secret` (unique)
- `enabled` (indexed)
- Compound: `{ userId: 1, enabled: 1 }`

**Notes**:
- Full API Key token format: `<bot_id>:<secret>`
- `bot_id` is calculated: `20231226 + (ObjectId timestamp % 10000)`
- Only `secret` is stored; full token is generated dynamically

### 4. DailyAssessments Collection

**Model**: `DailyAssessmentModel`
**Collection Name**: `dailyassessments`

```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: "User", indexed),
  date: string (YYYY-MM-DD, indexed),
  status: "completed" | "skipped",
  score?: number,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes**:
- `userId` (indexed)
- `date` (indexed)
- Compound: `{ userId: 1, date: 1 }` (unique)

**Notes**: Tracks daily financial literacy quiz completions. Streak = consecutive days with status "completed".

### 5. Commitments Collection

**Model**: `CommitmentModel`
**Collection Name**: `commitments`

```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: "User", indexed),
  weekOf: string (YYYY-MM-DD, indexed),
  commitmentText: string (required),
  status: "active" | "completed" | "abandoned" (default: "active", indexed),
  midWeekCheckInDate?: Date,
  midWeekResponse?: string,
  midWeekReminderSentAt?: Date,
  aiObservations: string[] (default: []),
  completionSelfReport?: string,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes**:
- `userId` (indexed)
- `weekOf` (indexed)
- Compound: `{ userId: 1, weekOf: 1 }` (unique)
- Compound: `{ userId: 1, status: 1 }`

**Notes**: Tracks weekly commitments from Sunday check-ins. Mid-week reminder cron runs Wed 6pm ET.

## Entity Relationships

```
User (1) ──< (many) Expense
User (1) ──< (many) APIKey
User (1) ──< (many) DailyAssessment
User (1) ──< (many) Commitment
```

## Important Notes

1. **API Keys**: Stored as separate collection, not embedded in User
2. **Goal Targets**: Stored in User model as `goalTargets` Map
3. **Expenses**: Linked to User via `userId` ObjectId reference
4. **Timestamps**: All models use Mongoose `timestamps: true` for `createdAt`/`updatedAt`
