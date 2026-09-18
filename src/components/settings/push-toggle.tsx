"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { isIos, isPushSupported, isStandalone, subscriptionToJson, urlBase64ToUint8Array } from "@/lib/push";
import { removeSubscription, saveSubscription } from "@/app/(app)/settings/push/actions";

type Status = "loading" | "unsupported" | "ios-needs-install" | "off" | "on";

export function PushToggle() {
  const [status, setStatus] = useState<Status>("loading");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    async function init() {
      if (!isPushSupported()) {
        setStatus("unsupported");
        return;
      }
      if (isIos() && !isStandalone()) {
        setStatus("ios-needs-install");
        return;
      }
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setStatus(subscription ? "on" : "off");
    }
    init().catch(() => setStatus("unsupported"));
  }, []);

  async function enable() {
    setPending(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        toast.error("Notification permission was denied.");
        return;
      }

      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidPublicKey) {
        toast.error("Push isn't configured for this app yet.");
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });

      await saveSubscription(subscriptionToJson(subscription));
      setStatus("on");
      toast.success("Push notifications enabled");
    } catch {
      toast.error("Couldn't enable push notifications.");
    } finally {
      setPending(false);
    }
  }

  async function disable() {
    setPending(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await removeSubscription(subscription.endpoint);
        await subscription.unsubscribe();
      }
      setStatus("off");
      toast.success("Push notifications turned off");
    } catch {
      toast.error("Couldn't turn off push notifications.");
    } finally {
      setPending(false);
    }
  }

  if (status === "loading") return null;

  if (status === "unsupported") {
    return (
      <p className="text-sm text-muted-foreground">
        Push notifications aren&apos;t supported in this browser.
      </p>
    );
  }

  if (status === "ios-needs-install") {
    return (
      <p className="text-sm text-muted-foreground">
        On iPhone/iPad, push notifications only work once this app is added to
        your home screen: tap Share, then &ldquo;Add to Home Screen&rdquo;, then
        open it from there to enable this.
      </p>
    );
  }

  return (
    <div className="flex items-center justify-between gap-3">
      <Label htmlFor="push-toggle" className="flex-1 text-sm font-normal text-foreground">
        Remind me before bills are due
      </Label>
      <Switch
        id="push-toggle"
        checked={status === "on"}
        disabled={pending}
        onCheckedChange={(checked) => (checked ? enable() : disable())}
      />
    </div>
  );
}
