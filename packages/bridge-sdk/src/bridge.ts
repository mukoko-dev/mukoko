import type {
  MukokoBridgeAPI,
  MukokoUser,
  Interest,
  AuthBridge,
  HoneyBridge,
  ShamwariBridge,
  WalletBridge,
  DeviceBridge,
  NavBridge,
  StorageBridge,
  ReputationBridge,
} from "@mukoko/types";

declare global {
  interface Window {
    MukokoBridge?: MukokoBridgeAPI;
  }
}

/**
 * Typed wrapper around `window.MukokoBridge` -- the communication layer
 * between the Flutter shell and Preact mini-apps running inside WebViews.
 *
 * Usage:
 * ```ts
 * import { bridge } from "@mukoko/bridge";
 *
 * const user = await bridge.auth.getUser();
 * ```
 */
class MukokoBridge implements Record<
  "auth" | "honey" | "shamwari" | "wallet" | "device" | "nav" | "storage" | "reputation",
  unknown
> {
  // ---------------------------------------------------------------------------
  // Internal helpers
  // ---------------------------------------------------------------------------

  /** Return the native bridge object or throw. */
  private getNativeBridge(): MukokoBridgeAPI {
    const native = window.MukokoBridge;
    if (!native) {
      throw new Error("MukokoBridge is not available. Are you running inside the Mukoko WebView?");
    }
    return native;
  }

  /** Check whether the native bridge is injected into the page. */
  static isAvailable(): boolean {
    return typeof window !== "undefined" && typeof window.MukokoBridge !== "undefined";
  }

  // ---------------------------------------------------------------------------
  // auth
  // ---------------------------------------------------------------------------

  auth: AuthBridge = {
    getUser: async (): Promise<MukokoUser | null> => {
      return this.getNativeBridge().auth.getUser();
    },

    getToken: async (): Promise<string | null> => {
      return this.getNativeBridge().auth.getToken();
    },

    onAuthChange: (cb: (user: MukokoUser | null) => void): (() => void) => {
      return this.getNativeBridge().auth.onAuthChange(cb);
    },
  };

  // ---------------------------------------------------------------------------
  // honey  (interest engine)
  // ---------------------------------------------------------------------------

  honey: HoneyBridge = {
    getInterests: async (): Promise<Interest[]> => {
      return this.getNativeBridge().honey.getInterests();
    },

    trackInteraction: (interaction: {
      type: string;
      contentId: string;
      duration?: number;
    }): void => {
      this.getNativeBridge().honey.trackInteraction(interaction);
    },

    getSuggestions: async (context: string): Promise<string[]> => {
      return this.getNativeBridge().honey.getSuggestions(context);
    },
  };

  // ---------------------------------------------------------------------------
  // shamwari  (AI assistant)
  // ---------------------------------------------------------------------------

  shamwari: ShamwariBridge = {
    ask: async (question: string): Promise<string> => {
      return this.getNativeBridge().shamwari.ask(question);
    },

    summarize: async (content: string): Promise<string> => {
      return this.getNativeBridge().shamwari.summarize(content);
    },

    translate: async (text: string, lang: string): Promise<string> => {
      return this.getNativeBridge().shamwari.translate(text, lang);
    },
  };

  // ---------------------------------------------------------------------------
  // wallet
  // ---------------------------------------------------------------------------

  wallet: WalletBridge = {
    getBalance: async (): Promise<{
      fiat: number;
      tokens: number;
      currency: string;
    }> => {
      return this.getNativeBridge().wallet.getBalance();
    },

    requestPayment: async (params: {
      amount: number;
      currency: string;
      description: string;
    }): Promise<{ success: boolean; transactionId?: string }> => {
      return this.getNativeBridge().wallet.requestPayment(params);
    },

    transferTokens: async (params: {
      to: string;
      amount: number;
    }): Promise<{ success: boolean }> => {
      return this.getNativeBridge().wallet.transferTokens(params);
    },

    onPaymentResult: (
      cb: (result: { success: boolean; transactionId?: string }) => void,
    ): (() => void) => {
      return this.getNativeBridge().wallet.onPaymentResult(cb);
    },
  };

  // ---------------------------------------------------------------------------
  // device
  // ---------------------------------------------------------------------------

  device: DeviceBridge = {
    getLocation: async (): Promise<{ lat: number; lng: number }> => {
      return this.getNativeBridge().device.getLocation();
    },

    openCamera: async (): Promise<{ uri: string }> => {
      return this.getNativeBridge().device.openCamera();
    },

    scanQR: async (): Promise<{ data: string }> => {
      return this.getNativeBridge().device.scanQR();
    },

    share: async (params: { title: string; text?: string; url?: string }): Promise<void> => {
      return this.getNativeBridge().device.share(params);
    },

    haptic: (type: "light" | "medium" | "heavy"): void => {
      this.getNativeBridge().device.haptic(type);
    },
  };

  // ---------------------------------------------------------------------------
  // nav
  // ---------------------------------------------------------------------------

  nav: NavBridge = {
    openMiniApp: (appId: string, params?: Record<string, string>): void => {
      this.getNativeBridge().nav.openMiniApp(appId, params);
    },

    goBack: (): void => {
      this.getNativeBridge().nav.goBack();
    },

    setTitle: (title: string): void => {
      this.getNativeBridge().nav.setTitle(title);
    },
  };

  // ---------------------------------------------------------------------------
  // storage
  // ---------------------------------------------------------------------------

  storage: StorageBridge = {
    get: async (key: string): Promise<string | null> => {
      return this.getNativeBridge().storage.get(key);
    },

    set: async (key: string, value: string): Promise<void> => {
      return this.getNativeBridge().storage.set(key, value);
    },

    remove: async (key: string): Promise<void> => {
      return this.getNativeBridge().storage.remove(key);
    },
  };

  // ---------------------------------------------------------------------------
  // reputation
  // ---------------------------------------------------------------------------

  reputation: ReputationBridge = {
    getScore: async (): Promise<number> => {
      return this.getNativeBridge().reputation.getScore();
    },

    getTokenBalance: async (): Promise<number> => {
      return this.getNativeBridge().reputation.getTokenBalance();
    },
  };
}

/** Singleton bridge instance. */
export const bridge = new MukokoBridge();

export { MukokoBridge };
