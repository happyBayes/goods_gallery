/**
 * Rate Limiter Utility
 * 
 * Implements time-window based rate limiting to control API usage
 * and prevent excessive requests.
 */

import { RateLimitConfig } from '../types/creativeDesign';

/**
 * Custom error for rate limit violations
 */
export class RateLimitError extends Error {
    constructor(message: string, public waitTime: number) {
        super(message);
        this.name = 'RateLimitError';
    }
}

/**
 * Rate limiter class that tracks requests within a time window
 */
export class RateLimiter {
    private requests: number[] = [];
    private config: RateLimitConfig;

    constructor(config: RateLimitConfig) {
        this.config = config;
    }

    /**
     * Check if a new request can be made, throw error if limit exceeded
     */
    async checkLimit(): Promise<void> {
        const now = Date.now();

        // Clean up expired request records
        this.requests = this.requests.filter(
            time => now - time < this.config.windowMs
        );

        // Check if limit is exceeded
        if (this.requests.length >= this.config.maxRequests) {
            const oldestRequest = this.requests[0];
            const waitTime = this.config.windowMs - (now - oldestRequest);
            throw new RateLimitError(
                `请等待 ${Math.ceil(waitTime / 1000)} 秒后再试`,
                waitTime
            );
        }

        // Record new request
        this.requests.push(now);
    }

    /**
     * Get the number of remaining requests in the current window
     */
    getRemainingRequests(): number {
        const now = Date.now();
        this.requests = this.requests.filter(
            time => now - time < this.config.windowMs
        );
        return this.config.maxRequests - this.requests.length;
    }

    /**
     * Get the timestamp when the rate limit will reset
     */
    getResetTime(): number {
        if (this.requests.length === 0) return 0;
        const oldestRequest = this.requests[0];
        return oldestRequest + this.config.windowMs;
    }

    /**
     * Get the time remaining until the rate limit resets (in milliseconds)
     */
    getTimeUntilReset(): number {
        const resetTime = this.getResetTime();
        if (resetTime === 0) return 0;
        return Math.max(0, resetTime - Date.now());
    }

    /**
     * Reset the rate limiter (clear all request history)
     */
    reset(): void {
        this.requests = [];
    }
}
