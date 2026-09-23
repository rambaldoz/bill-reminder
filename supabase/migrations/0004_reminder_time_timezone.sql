-- Bill Tracker & Reminder — per-bill reminder time + per-user timezone
-- Run this once in the Supabase SQL Editor, after 0001-0003.

-- IANA timezone name, so "remind me at 9am" means 9am in the user's own
-- timezone rather than server time.
alter table profiles add column if not exists timezone text not null default 'Asia/Dubai';

-- Default time-of-day for new bills' reminders, editable in Settings.
alter table profiles add column if not exists default_reminder_time time not null default '09:00';

-- Per-bill override, mirroring reminder_offset_days.
alter table bills add column if not exists reminder_time time not null default '09:00';
