import type { ApiResponse, PaginatedResponse } from "@mukoko/types";
import { ApiClientError } from "./errors.js";

interface ClientConfig {
  baseUrl: string;
  getToken?: () => Promise<string | null>;
}

interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string>;
  body?: unknown;
  signal?: AbortSignal;
}

const MAX_RETRIES = 2;
const INITIAL_BACKOFF_MS = 500;

/**
 * Shared API client for communicating with Mukoko Cloudflare Workers.
 * Used by mini-apps and the web landing page.
 */
export class MukokoClient {
  private readonly baseUrl: string;
  private readonly getToken?: () => Promise<string | null>;

  constructor(config: ClientConfig) {
    // Strip trailing slash from baseUrl for consistent path joining
    this.baseUrl = config.baseUrl.replace(/\/+$/, "");
    this.getToken = config.getToken;
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  /**
   * Core request method with auth, JSON handling, and retry logic.
   * Retries up to MAX_RETRIES times for 5xx errors with exponential backoff.
   */
  private async request<T>(
    method: string,
    path: string,
    options?: RequestOptions,
  ): Promise<T> {
    const url = this.buildUrl(path, options?.params);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...options?.headers,
    };

    // Attach bearer token when a token provider is configured
    if (this.getToken) {
      const token = await this.getToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    const fetchOptions: RequestInit = {
      method,
      headers,
      signal: options?.signal,
    };

    if (options?.body !== undefined) {
      fetchOptions.body = JSON.stringify(options.body);
    }

    let lastError: unknown;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const response = await fetch(url.toString(), fetchOptions);

        if (response.ok) {
          // Handle 204 No Content
          if (response.status === 204) {
            return undefined as T;
          }
          const json = (await response.json()) as T;
          return json;
        }

        // Parse the error body (may not always be JSON)
        let errorMessage = `Request failed with status ${response.status}`;
        let errorCode = "UNKNOWN_ERROR";
        let errorDetails: unknown;
        try {
          const body = (await response.json()) as { error?: { code?: string; message?: string; details?: unknown } };
          if (body.error) {
            errorMessage = body.error.message ?? errorMessage;
            errorCode = body.error.code ?? errorCode;
            errorDetails = body.error.details;
          }
        } catch {
          // Response body was not valid JSON
        }

        const apiError = new ApiClientError(
          errorMessage,
          response.status,
          errorCode,
          errorDetails,
        );

        // Only retry on server errors (5xx)
        if (response.status >= 500 && attempt < MAX_RETRIES) {
          lastError = apiError;
          await this.sleep(INITIAL_BACKOFF_MS * Math.pow(2, attempt));
          continue;
        }

        throw apiError;
      } catch (error) {
        // If it is already an ApiClientError, re-throw unless we should retry
        if (error instanceof ApiClientError) {
          if (error.status >= 500 && attempt < MAX_RETRIES) {
            lastError = error;
            await this.sleep(INITIAL_BACKOFF_MS * Math.pow(2, attempt));
            continue;
          }
          throw error;
        }

        // Network errors or other unexpected failures - retry
        lastError = error;
        if (attempt < MAX_RETRIES) {
          await this.sleep(INITIAL_BACKOFF_MS * Math.pow(2, attempt));
          continue;
        }

        throw error;
      }
    }

    // Should not reach here, but just in case
    throw lastError;
  }

  /**
   * Build a full URL from baseUrl + path, appending query params if provided.
   */
  private buildUrl(
    path: string,
    params?: Record<string, string>,
  ): URL {
    const url = new URL(`${this.baseUrl}${path}`);
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        url.searchParams.set(key, value);
      }
    }
    return url;
  }

  /**
   * Simple sleep helper for exponential backoff.
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // ---------------------------------------------------------------------------
  // Public HTTP methods
  // ---------------------------------------------------------------------------

  /**
   * Perform a GET request.
   */
  async get<T>(
    path: string,
    options?: Omit<RequestOptions, "body">,
  ): Promise<ApiResponse<T>> {
    return this.request<ApiResponse<T>>("GET", path, options);
  }

  /**
   * Perform a POST request.
   */
  async post<T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, "body">,
  ): Promise<ApiResponse<T>> {
    return this.request<ApiResponse<T>>("POST", path, {
      ...options,
      body,
    });
  }

  /**
   * Perform a PUT request.
   */
  async put<T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, "body">,
  ): Promise<ApiResponse<T>> {
    return this.request<ApiResponse<T>>("PUT", path, {
      ...options,
      body,
    });
  }

  /**
   * Perform a PATCH request.
   */
  async patch<T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, "body">,
  ): Promise<ApiResponse<T>> {
    return this.request<ApiResponse<T>>("PATCH", path, {
      ...options,
      body,
    });
  }

  /**
   * Perform a DELETE request.
   */
  async delete<T>(
    path: string,
    options?: Omit<RequestOptions, "body">,
  ): Promise<ApiResponse<T>> {
    return this.request<ApiResponse<T>>("DELETE", path, options);
  }

  // ---------------------------------------------------------------------------
  // Pagination helper
  // ---------------------------------------------------------------------------

  /**
   * Fetch a paginated endpoint. Passes page/pageSize as query params.
   */
  async paginated<T>(
    path: string,
    params?: Record<string, string>,
  ): Promise<PaginatedResponse<T>> {
    return this.request<PaginatedResponse<T>>("GET", path, { params });
  }
}
