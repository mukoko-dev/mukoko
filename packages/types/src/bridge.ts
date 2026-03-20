import type { MukokoUser } from "./user.js";
import type { Interest } from "./interest.js";

export interface BridgeMessage {
  id: string;
  type: string;
  payload: unknown;
  timestamp: number;
}

export interface BridgeResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
}

export interface AuthBridge {
  getUser(): Promise<MukokoUser | null>;
  getToken(): Promise<string | null>;
  onAuthChange(cb: (user: MukokoUser | null) => void): () => void;
}

export interface HoneyBridge {
  getInterests(): Promise<Interest[]>;
  trackInteraction(interaction: { type: string; contentId: string; duration?: number }): void;
  getSuggestions(context: string): Promise<string[]>;
}

export interface ShamwariBridge {
  ask(question: string): Promise<string>;
  summarize(content: string): Promise<string>;
  translate(text: string, lang: string): Promise<string>;
}

export interface WalletBridge {
  getBalance(): Promise<{ fiat: number; tokens: number; currency: string }>;
  requestPayment(params: {
    amount: number;
    currency: string;
    description: string;
  }): Promise<{ success: boolean; transactionId?: string }>;
  transferTokens(params: { to: string; amount: number }): Promise<{ success: boolean }>;
  onPaymentResult(cb: (result: { success: boolean; transactionId?: string }) => void): () => void;
}

export interface DeviceBridge {
  getLocation(): Promise<{ lat: number; lng: number }>;
  openCamera(): Promise<{ uri: string }>;
  scanQR(): Promise<{ data: string }>;
  share(params: { title: string; text?: string; url?: string }): Promise<void>;
  haptic(type: "light" | "medium" | "heavy"): void;
}

export interface NavBridge {
  openMiniApp(appId: string, params?: Record<string, string>): void;
  goBack(): void;
  setTitle(title: string): void;
}

export interface StorageBridge {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
}

export interface ReputationBridge {
  getScore(): Promise<number>;
  getTokenBalance(): Promise<number>;
}

export interface MukokoBridgeAPI {
  auth: AuthBridge;
  honey: HoneyBridge;
  shamwari: ShamwariBridge;
  wallet: WalletBridge;
  device: DeviceBridge;
  nav: NavBridge;
  storage: StorageBridge;
  reputation: ReputationBridge;
}
