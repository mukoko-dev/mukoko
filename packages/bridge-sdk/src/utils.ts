/**
 * Returns `true` when `window.MukokoBridge` is defined.
 */
export function isBridgeAvailable(): boolean {
  return typeof window !== "undefined" && typeof window.MukokoBridge !== "undefined";
}

/**
 * Returns `true` when the page is running inside a Flutter WebView.
 *
 * Detection heuristic:
 *  1. The native bridge object is present, OR
 *  2. The User-Agent contains "MukokoApp" (set by the Flutter shell), OR
 *  3. The `flutter_inappwebview` message handler is present.
 */
export function isInWebView(): boolean {
  if (typeof window === "undefined") return false;

  // Fastest check -- the bridge is already injected.
  if (window.MukokoBridge) return true;

  // UA sniffing as a secondary signal.
  if (typeof navigator !== "undefined" && /MukokoApp/i.test(navigator.userAgent)) {
    return true;
  }

  // Flutter InAppWebView typically exposes this handler.
  if (typeof (window as unknown as Record<string, unknown>).flutter_inappwebview !== "undefined") {
    return true;
  }

  return false;
}

/**
 * Returns a `Promise` that resolves once `window.MukokoBridge` becomes
 * available.  Useful during app startup when the Flutter shell may inject the
 * bridge asynchronously after the initial page load.
 *
 * @param timeout  Maximum time to wait in milliseconds.  Defaults to 5 000 ms.
 *                 If the bridge is not available within this window the promise
 *                 rejects with an error.
 */
export function waitForBridge(timeout = 5_000): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    // Already available -- resolve immediately.
    if (isBridgeAvailable()) {
      resolve();
      return;
    }

    const pollInterval = 50; // ms
    let elapsed = 0;

    const timer = setInterval(() => {
      if (isBridgeAvailable()) {
        clearInterval(timer);
        resolve();
        return;
      }

      elapsed += pollInterval;
      if (elapsed >= timeout) {
        clearInterval(timer);
        reject(new Error(`MukokoBridge did not become available within ${timeout} ms`));
      }
    }, pollInterval);
  });
}
