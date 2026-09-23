import { NextResponse, type NextRequest } from "next/server";
import webpush, { WebPushError } from "web-push";
import { createAdminClient } from "@/lib/supabase/admin";
import { addDaysIso, todayIso } from "@/lib/bills/status";
import { formatDateShort, formatMoney } from "@/lib/format";
import { nowInTimezone } from "@/lib/timezone";

export const dynamic = "force-dynamic";

// Bills due for a reminder: unpaid, never reminded, and due_date - offset
// has arrived in the bill owner's own timezone, at or after their chosen
// reminder time. This route is meant to be called every ~15 minutes (see
// .github/workflows/send-reminders.yml) rather than relying on Vercel's
// once-a-day Hobby-plan cron, so a chosen time is actually honored instead
// of only ever firing whenever the one daily cron happens to run.
const LOOKAHEAD_DAYS = 61;
const DEFAULT_TIMEZONE = "Asia/Dubai";

export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const vapidSubject = process.env.VAPID_SUBJECT;
  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
  if (!vapidSubject || !vapidPublicKey || !vapidPrivateKey) {
    return NextResponse.json({ error: "VAPID keys are not configured" }, { status: 500 });
  }
  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);

  const supabase = createAdminClient();
  // Broad, server-time-based pre-filter; precise eligibility is computed
  // per-bill below using the owner's own timezone.
  const horizon = addDaysIso(todayIso(), LOOKAHEAD_DAYS);

  const { data: candidates, error: fetchError } = await supabase
    .from("bills")
    .select(
      "id, user_id, title, amount, currency, due_date, reminder_offset_days, reminder_time, category:categories(name), profile:profiles(timezone)",
    )
    .is("paid_at", null)
    .is("reminder_sent_at", null)
    .lte("due_date", horizon);

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  const due = (candidates ?? []).filter((bill) => {
    const profile = Array.isArray(bill.profile) ? bill.profile[0] : bill.profile;
    const timezone = profile?.timezone || DEFAULT_TIMEZONE;
    const { date: userToday, time: userNow } = nowInTimezone(timezone);

    const triggerDate = addDaysIso(bill.due_date, -bill.reminder_offset_days);
    const dateEligible = triggerDate <= userToday;
    const timeEligible = userNow >= bill.reminder_time.slice(0, 5);
    return dateEligible && timeEligible;
  });

  let sent = 0;
  let skippedNoSubscription = 0;
  let subscriptionsRemoved = 0;

  for (const bill of due) {
    const { data: subscriptions, error: subError } = await supabase
      .from("push_subscriptions")
      .select("id, endpoint, p256dh, auth")
      .eq("user_id", bill.user_id);

    if (subError) continue;

    if (!subscriptions || subscriptions.length === 0) {
      skippedNoSubscription++;
      continue;
    }

    const category = Array.isArray(bill.category) ? bill.category[0] : bill.category;
    const payload = JSON.stringify({
      title: category ? `${bill.title} — ${category.name}` : bill.title,
      body: `${formatMoney(bill.amount, bill.currency)} due ${formatDateShort(bill.due_date)}`,
      url: `/bills/${bill.id}`,
    });

    for (const subscription of subscriptions) {
      try {
        await webpush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: { p256dh: subscription.p256dh, auth: subscription.auth },
          },
          payload,
        );
      } catch (err) {
        if (err instanceof WebPushError && (err.statusCode === 404 || err.statusCode === 410)) {
          await supabase.from("push_subscriptions").delete().eq("id", subscription.id);
          subscriptionsRemoved++;
        }
      }
    }

    await supabase.from("bills").update({ reminder_sent_at: new Date().toISOString() }).eq("id", bill.id);
    sent++;
  }

  return NextResponse.json({
    checked: due.length,
    sent,
    skippedNoSubscription,
    subscriptionsRemoved,
  });
}
