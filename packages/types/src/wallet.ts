export interface WalletTransaction {
  id: string;
  userId: string;
  type: "payment" | "transfer" | "earning" | "purchase";
  amount: number;
  currency: string;
  method: "ecocash" | "innbucks" | "mukoko_token" | "bank" | "card";
  status: "pending" | "completed" | "failed";
  description: string;
  createdAt: string;
}

export interface TokenBalance {
  available: number;
  pending: number;
  lifetime: number;
}
