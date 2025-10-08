# 🧾 Admin Funding & Dispute Management Flow

This document outlines how admin resolution, funding verification, and dispute management work across both wallet fundings and data purchases in the application.

## ⚙️ Overview

The admin panel provides tools to:

- Manually verify wallet fundings when Paystack webhooks fail.
- Resolve user disputes for failed data purchases or funding issues.
- Maintain a clean transaction ledger while preserving audit trails for all actions.

## 💳 Wallet Funding Flow

### 1. User-Initiated Funding

When a user initiates a wallet funding:

- A new record is created in `wallet_fundings` with:
  - `status = 'pending'`

This serves as the initial log of the payment attempt.

- No wallet credit is applied yet.

### 2. Paystack Webhook Verification

When Paystack calls the webhook (`/api/paystack/webhook`):

- The app verifies the event signature for authenticity.
- If the event is `charge.success`:
  - Updates the matching `wallet_fundings` record → `status: completed`.
  - Inserts a new record into `transactions`.
  - Credits the user’s wallet via `increment_wallet_balance` RPC.
- If the webhook never fires (e.g., network issues or wrong URL), the funding remains pending.

### 3. Manual Admin Verification (Backup)

Admin can manually verify such pending fundings via:

`POST /api/admin/verify-funding`

**Steps performed internally:**

| Step | Action                                                            |
| ---- | ----------------------------------------------------------------- |
| 1️⃣   | Verifies admin session (secure access).                           |
| 2️⃣   | Calls Paystack’s `/transaction/verify/{reference}` endpoint.      |
| 3️⃣   | Confirms funding record exists in `wallet_fundings`.              |
| 4️⃣   | Updates record → `status: completed` and saves Paystack response. |
| 5️⃣   | Inserts new transaction if not already recorded.                  |
| 6️⃣   | Increments user wallet balance via Supabase RPC.                  |
| 7️⃣   | Logs the entire operation in `admin_activity_logs`.               |

**Response Example:**

```json
{
  "success": true,
  "message": "Funding verified, transaction created, and wallet credited."
}
```

## 📦 Data Purchase Dispute Flow

### 1. User Dispute Submission

Users can raise disputes only for completed purchases.  
When raised:

- The related `transaction.status` becomes `disputed`.
- The dispute details (`dispute_type`, `dispute_note`) are stored on the same transaction record.

### 2. Admin Resolution Panel

Admins can:

- View dispute details in a modal.
- Refund wallet (full or partial) — validated not to exceed the transaction amount.
- Reject dispute — marks record as resolved with rejection.
- Mark Pending Review — updates status to `under_review` for later handling.

Each resolution automatically logs:

- `resolved_by` (admin ID)
- `resolved_at` (timestamp)
- Optional `admin_note` for context.

## 🧾 Tables & Responsibilities

| Table                 | Purpose                                  | Notes                                                                              |
| --------------------- | ---------------------------------------- | ---------------------------------------------------------------------------------- |
| `wallet_fundings`     | Tracks all funding attempts.             | Includes status (pending, completed, failed) and reference to Paystack’s response. |
| `transactions`        | Ledger of confirmed financial movements. | Only successful fundings or purchases are inserted here.                           |
| `admin_activity_logs` | Immutable record of every admin action.  | Includes action type, admin ID, timestamps, and JSON details.                      |

## 🛡️ Data & Security Design

- Admin routes use `createServerClient` with Supabase Service Role (server-only).
- User routes use scoped Supabase clients to enforce RLS (Row-Level Security).
- The `transactions` table is immutable — no updates or deletes allowed.
- Each admin action is auditable for accountability and compliance.

## 🧠 Design Philosophy

- Keep `wallet_fundings` as audit trail — all attempts, even failures.
- Keep `transactions` clean — only confirmed balance movements.
- Ensure consistency — avoid double crediting or partial updates.
- Log every admin action — for full transparency.

## 🚀 Future Enhancements

- Filtering & search in admin dashboard (status, date range, user).
- Email or in-app notifications for dispute outcomes.
- Webhook retry queue (for delayed Paystack callbacks).
- Export audit logs to CSV for compliance or accounting.
- Admin overview analytics (pending verifications, total refunds, etc.).

## ✅ Quick Summary

| Flow                          | Source             | Result    | Ledger Impact                                    |
| ----------------------------- | ------------------ | --------- | ------------------------------------------------ |
| Wallet Funding (auto)         | Paystack Webhook   | Completed | Credits wallet + inserts transaction             |
| Wallet Funding (manual)       | Admin Verify Route | Completed | Same as webhook, logged in `admin_activity_logs` |
| Data Dispute (refund)         | Admin Modal        | Refunded  | Creates wallet credit via RPC                    |
| Data Dispute (reject/pending) | Admin Modal        | Updated   | Marks as resolved/pending only                   |

## 📎 Author Notes

**Built with:**

- Next.js (App Router)
- Supabase (PostgreSQL + Auth)
- Paystack API
- TailwindCSS + shadcn/ui
- TypeScript + Server Actions
- Sonner for admin notifications

Yes, including small code snippets would be a great addition—it'll make this doc even more useful as a quick reference for devs maintaining or extending the system. For example, drop in the handler for the verify route and the refund action from the modal. If you have those ready, feel free to append them!
