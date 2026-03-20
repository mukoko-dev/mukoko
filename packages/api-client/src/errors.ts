/**
 * Custom error class for API client errors.
 * Thrown when the API returns a non-ok HTTP response.
 */
export class ApiClientError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly details: unknown | undefined;

  constructor(message: string, status: number, code: string, details?: unknown) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = code;
    this.details = details;

    // Restore prototype chain (necessary when extending built-ins in TS)
    Object.setPrototypeOf(this, ApiClientError.prototype);
  }
}

/**
 * Type guard to check if an unknown error is an ApiClientError.
 */
export function isApiError(error: unknown): error is ApiClientError {
  return error instanceof ApiClientError;
}
