"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export default function NotificationSettings() {
  const [status, setStatus] = useState<
    "unsupported" | "denied" | "subscribed" | "unsubscribed" | "loading"
  >("loading");

  useEffect(() => {
    async function checkStatus() {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        setStatus("unsupported");
        return;
      }
      if (Notification.permission === "denied") {
        setStatus("denied");
        return;
      }
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setStatus(subscription ? "subscribed" : "unsubscribed");
    }
    checkStatus();
  }, []);

  async function enableNotifications() {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      setStatus("denied");
      return;
    }

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
      ),
    });

    await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subscription),
    });

    setStatus("subscribed");
  }

  async function disableNotifications() {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      await fetch("/api/push/subscribe", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: subscription.endpoint }),
      });
      await subscription.unsubscribe();
    }

    setStatus("unsubscribed");
  }

  if (status === "loading") return null;

  if (status === "unsupported") {
    return (
      <p className="text-sm text-muted-foreground">
        Notifications aren&apos;t supported here. On iPhone, add this app to
        your Home Screen first, then open it from there and try again.
      </p>
    );
  }

  if (status === "denied") {
    return (
      <p className="text-sm text-muted-foreground">
        Notifications are blocked. Enable them for this app in your phone&apos;s
        Settings.
      </p>
    );
  }

  return status === "subscribed" ? (
    <Button onClick={disableNotifications} variant="outline">
      Disable notifications
    </Button>
  ) : (
    <Button onClick={enableNotifications}>Enable notifications</Button>
  );
}
