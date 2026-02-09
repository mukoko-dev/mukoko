/**
 * Pre-configured endpoint paths for all Mukoko API routes.
 * Used with MukokoClient to build full request URLs.
 */
export const ENDPOINTS = {
  // Auth (Mukoko ID)
  AUTH_SESSION: "/auth/session",
  AUTH_USER: "/auth/user",

  // Clips
  CLIPS_ARTICLES: "/clips/articles",
  CLIPS_CATEGORIES: "/clips/categories",
  CLIPS_SOURCES: "/clips/sources",
  CLIPS_TRENDING: "/clips/trending",

  // Pulse
  PULSE_FEED: "/pulse/feed",
  PULSE_TRENDING: "/pulse/trending",

  // Connect
  CONNECT_CIRCLES: "/connect/circles",
  CONNECT_DISCUSSIONS: "/connect/discussions",

  // Novels
  NOVELS_LIST: "/novels",
  NOVELS_CHAPTERS: "/novels/chapters",

  // Events
  EVENTS_LIST: "/events",
  EVENTS_NEARBY: "/events/nearby",

  // Weather
  WEATHER_CURRENT: "/weather/current",
  WEATHER_FORECAST: "/weather/forecast",

  // Wallet
  WALLET_BALANCE: "/wallet/balance",
  WALLET_TRANSACTIONS: "/wallet/transactions",

  // Shamwari
  SHAMWARI_ASK: "/shamwari/ask",
  SHAMWARI_SUMMARIZE: "/shamwari/summarize",

  // Registry
  MINIAPP_MANIFEST: "/registry/manifests",
} as const;
