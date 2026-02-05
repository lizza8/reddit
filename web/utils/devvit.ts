import type { ServerMessage, WebMessage } from "../../src/messages";

type DevvitWebContext = {
  subredditName?: string;
  userId?: string;
};

export function getDevvitContext(): DevvitWebContext {
  if (typeof globalThis === "undefined") {
    return {};
  }
  const devvit = (globalThis as { devvit?: { context?: DevvitWebContext } }).devvit;
  return devvit?.context ?? {};
}

export function sendWebMessage(message: WebMessage): void {
  if (typeof window === "undefined" || !window.parent) {
    return;
  }
  window.parent.postMessage({ type: "devvit-message", data: { message } }, "*");
}

export function extractServerMessage(event: MessageEvent): ServerMessage | null {
  const payload =
    event.data?.type === "devvit-message" ? event.data?.data?.message : event.data;
  if (!payload || typeof payload !== "object") {
    return null;
  }
  if (!("type" in payload)) {
    return null;
  }
  return payload as ServerMessage;
}
