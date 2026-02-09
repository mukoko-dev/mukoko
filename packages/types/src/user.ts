import type { Interest } from "./interest.js";

export interface MukokoUser {
  id: string;
  email: string;
  displayName: string;
  avatar: string | null;
  interests: Interest[];
  reputation: number;
  tokenBalance: number;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = "user" | "creator" | "moderator" | "admin" | "super_admin";

export interface DigitalTwin {
  userId: string;
  nftTokenId: string | null;
  personalityVector: number[];
  interestWeights: Record<string, number>;
  evolutionHistory: EvolutionEntry[];
}

export interface EvolutionEntry {
  timestamp: string;
  category: string;
  weight: number;
}
