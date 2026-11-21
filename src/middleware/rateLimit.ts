// Best-effort in-memory rate limiter. On serverless platforms each instance has its
// own memory, so this slows abuse but is not a hard guarantee. For strict limits put
// Vercel Firewall / Cloudflare rules in front of /api.
import { Request, Response, NextFunction } from 'express';

export function getClientIp(req: Request): string {
  // Only trust forwarding headers set by infrastructure we control; otherwise a visitor could
  // send a fake X-Forwarded-For and dodge the limits.
  if (process.env.VERCEL) {
    const v = req.headers['x-vercel-forwarded-for'] || req.headers['x-real-ip'];
    if (typeof v === 'string' && v) return v.split(',')[0].trim();
  }
  if (process.env.TRUST_PROXY === '1') {
    const f = req.headers['x-forwarded-for'];
    if (typeof f === 'string' && f) return f.split(',').pop()!.trim(); // hop added by our own proxy
  }
  return req.socket.remoteAddress || 'unknown_ip';
}

export function rateLimit(name: string, max: number, windowMs: number) {
  const hits = new Map<string, { count: number; resetAt: number }>();
  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    if (hits.size > 5000) {
      for (const [k, v] of hits) if (v.resetAt < now) hits.delete(k);
    }
    const key = `${name}:${getClientIp(req)}`;
    const rec = hits.get(key);
    if (!rec || rec.resetAt < now) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }
    rec.count += 1;
    if (rec.count > max) {
      res.setHeader('Retry-After', Math.ceil((rec.resetAt - now) / 1000));
      return res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }
    return next();
  };
}
