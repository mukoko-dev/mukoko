// Bridge singleton & class
export { bridge, MukokoBridge } from "./bridge.js";

// Mock for local development
export { mockBridge, MockBridge } from "./mock.js";

// Utility helpers
export { isBridgeAvailable, isInWebView, waitForBridge } from "./utils.js";

// Re-export bridge-related types for convenience so consumers don't need
// a direct dependency on @mukoko/types just for bridge interfaces.
export type {
  MukokoBridgeAPI,
  AuthBridge,
  HoneyBridge,
  ShamwariBridge,
  WalletBridge,
  DeviceBridge,
  NavBridge,
  StorageBridge,
  ReputationBridge,
  BridgeMessage,
  BridgeResponse,
} from "@mukoko/types";
