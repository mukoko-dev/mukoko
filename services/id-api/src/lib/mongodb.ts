// MongoDB Atlas connection helper for Cloudflare Workers
// Note: In Workers, connections are ephemeral per request
// Consider using MongoDB Data API or a connection pooler for production

export function getMongoDBUri(env: { MONGODB_URI: string }): string {
  return env.MONGODB_URI;
}

// TODO: Implement MongoDB client initialization when mongodb driver supports Workers
// For now, use MongoDB Data API or Cloudflare Containers for MongoDB access
