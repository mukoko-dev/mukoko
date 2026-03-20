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

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const MOCK_USER: MukokoUser = {
  id: "mock-user-001",
  email: "dev@mukoko.app",
  displayName: "Mukoko Dev",
  avatar: null,
  interests: [
    { categoryId: "Technology", weight: 0.9, keywords: ["typescript", "flutter"] },
    { categoryId: "Music", weight: 0.7, keywords: ["afrobeats", "gospel"] },
    { categoryId: "Business", weight: 0.5, keywords: ["startups", "fintech"] },
  ],
  reputation: 42,
  tokenBalance: 1000,
  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2025-06-01T00:00:00Z",
};

const MOCK_INTERESTS: Interest[] = [
  { categoryId: "Technology", weight: 0.9, keywords: ["typescript", "flutter"] },
  { categoryId: "Music", weight: 0.7, keywords: ["afrobeats", "gospel"] },
  { categoryId: "Business", weight: 0.5, keywords: ["startups", "fintech"] },
];

// ---------------------------------------------------------------------------
// In-memory storage for the mock
// ---------------------------------------------------------------------------

const mockStorage = new Map<string, string>();

// ---------------------------------------------------------------------------
// MockBridge
// ---------------------------------------------------------------------------

/**
 * A mock implementation of the Mukoko bridge API that returns plausible
 * default data.  Use this for local development when you are NOT running
 * inside the Flutter WebView.
 *
 * ```ts
 * import { MockBridge } from "@mukoko/bridge";
 *
 * const mock = new MockBridge();
 * const user = await mock.auth.getUser(); // returns a mock user
 * ```
 */
class MockBridge implements MukokoBridgeAPI {
  // -------------------------------------------------------------------------
  // auth
  // -------------------------------------------------------------------------

  auth: AuthBridge = {
    getUser: async (): Promise<MukokoUser | null> => {
      return MOCK_USER;
    },

    getToken: async (): Promise<string | null> => {
      return "mock-session-token";
    },

    onAuthChange: (_cb: (user: MukokoUser | null) => void): (() => void) => {
      // In the mock we never fire auth changes -- return a no-op unsubscribe.
      return () => {
        /* noop */
      };
    },
  };

  // -------------------------------------------------------------------------
  // honey
  // -------------------------------------------------------------------------

  honey: HoneyBridge = {
    getInterests: async (): Promise<Interest[]> => {
      return MOCK_INTERESTS;
    },

    trackInteraction: (interaction: {
      type: string;
      contentId: string;
      duration?: number;
    }): void => {
      console.log("[MockBridge] trackInteraction", interaction);
    },

    getSuggestions: async (_context: string): Promise<string[]> => {
      return ["Technology", "Music", "Business"];
    },
  };

  // -------------------------------------------------------------------------
  // shamwari
  // -------------------------------------------------------------------------

  shamwari: ShamwariBridge = {
    ask: async (question: string): Promise<string> => {
      console.log("[MockBridge] shamwari.ask", question);
      return `Mock answer to: ${question}`;
    },

    summarize: async (content: string): Promise<string> => {
      console.log("[MockBridge] shamwari.summarize", content.slice(0, 80));
      return `Summary of ${content.length} characters of content.`;
    },

    translate: async (text: string, lang: string): Promise<string> => {
      console.log("[MockBridge] shamwari.translate", { text, lang });
      return `[${lang}] ${text}`;
    },
  };

  // -------------------------------------------------------------------------
  // wallet
  // -------------------------------------------------------------------------

  wallet: WalletBridge = {
    getBalance: async (): Promise<{
      fiat: number;
      tokens: number;
      currency: string;
    }> => {
      return { fiat: 250.0, tokens: 1000, currency: "USD" };
    },

    requestPayment: async (params: {
      amount: number;
      currency: string;
      description: string;
    }): Promise<{ success: boolean; transactionId?: string }> => {
      console.log("[MockBridge] wallet.requestPayment", params);
      return { success: true, transactionId: "mock-tx-001" };
    },

    transferTokens: async (params: {
      to: string;
      amount: number;
    }): Promise<{ success: boolean }> => {
      console.log("[MockBridge] wallet.transferTokens", params);
      return { success: true };
    },

    onPaymentResult: (
      _cb: (result: { success: boolean; transactionId?: string }) => void,
    ): (() => void) => {
      return () => {
        /* noop */
      };
    },
  };

  // -------------------------------------------------------------------------
  // device
  // -------------------------------------------------------------------------

  device: DeviceBridge = {
    getLocation: async (): Promise<{ lat: number; lng: number }> => {
      // Default: Harare, Zimbabwe
      return { lat: -17.8252, lng: 31.0335 };
    },

    openCamera: async (): Promise<{ uri: string }> => {
      console.log("[MockBridge] device.openCamera");
      return { uri: "file:///mock/photo.jpg" };
    },

    scanQR: async (): Promise<{ data: string }> => {
      console.log("[MockBridge] device.scanQR");
      return { data: "https://mukoko.app/mock-qr" };
    },

    share: async (params: { title: string; text?: string; url?: string }): Promise<void> => {
      console.log("[MockBridge] device.share", params);
    },

    haptic: (type: "light" | "medium" | "heavy"): void => {
      console.log("[MockBridge] device.haptic", type);
    },
  };

  // -------------------------------------------------------------------------
  // nav
  // -------------------------------------------------------------------------

  nav: NavBridge = {
    openMiniApp: (appId: string, params?: Record<string, string>): void => {
      console.log("[MockBridge] nav.openMiniApp", appId, params);
    },

    goBack: (): void => {
      console.log("[MockBridge] nav.goBack");
    },

    setTitle: (title: string): void => {
      console.log("[MockBridge] nav.setTitle", title);
      if (typeof document !== "undefined") {
        document.title = title;
      }
    },
  };

  // -------------------------------------------------------------------------
  // storage
  // -------------------------------------------------------------------------

  storage: StorageBridge = {
    get: async (key: string): Promise<string | null> => {
      return mockStorage.get(key) ?? null;
    },

    set: async (key: string, value: string): Promise<void> => {
      mockStorage.set(key, value);
    },

    remove: async (key: string): Promise<void> => {
      mockStorage.delete(key);
    },
  };

  // -------------------------------------------------------------------------
  // reputation
  // -------------------------------------------------------------------------

  reputation: ReputationBridge = {
    getScore: async (): Promise<number> => {
      return 42;
    },

    getTokenBalance: async (): Promise<number> => {
      return 1000;
    },
  };
}

/** Pre-built mock instance for convenience. */
export const mockBridge = new MockBridge();

export { MockBridge };
