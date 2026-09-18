-- Bill Tracker & Reminder — push reminders support
-- Run this once in the Supabase SQL Editor, after 0001 and 0002.

-- Tracks whether a reminder push has already gone out for a bill occurrence,
-- so the daily cron never sends more than one per bill (PRD: "no repeat spam").
alter table bills add column if not exists reminder_sent_at timestamptz;

-- Default reminder lead time for new bills, editable in Settings.
alter table profiles add column if not exists default_reminder_offset_days int not null default 3;

-- Speeds up the cron's daily scan for bills that are due for a reminder.
create index if not exists bills_reminder_pending_idx
  on bills (due_date)
  where paid_at is null and reminder_sent_at is null;
