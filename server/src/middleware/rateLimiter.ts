import { Request, Response, NextFunction } from 'express';

interface TokenBucket {
  tokens: number;
  lastRefill: number;
}

const buckets = new Map<string, TokenBucket>();

export const rateLimiter = (apiKey: string, maxRequests: number, windowMs: number): boolean => {
  const now = Date.now();
  let bucket = buckets.get(apiKey);

  if (!bucket) {
    bucket = { tokens: maxRequests, lastRefill: now };
    buckets.set(apiKey, bucket);
  } else {
    const timePassed = now - bucket.lastRefill;
    const tokensToAdd = (timePassed / windowMs) * maxRequests;
    bucket.tokens = Math.min(maxRequests, bucket.tokens + tokensToAdd);
    bucket.lastRefill = now;
  }

  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    return true;
  }

  return false;
};
