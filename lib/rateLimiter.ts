interface RateLimitEntry {
  count: number;
  date: string; // YYYY-MM-DD
}

export class RateLimiter {
  private storage: Map<string, RateLimitEntry>;

  constructor() {
    this.storage = new Map();
    // Nettoyer les anciennes entrées toutes les heures
    setInterval(() => this.cleanup(), 60 * 60 * 1000);
  }

  checkLimit(clientId: string, dailyLimit: number): { allowed: boolean; remaining: number } {
    const today = this.getTodayString();
    const entry = this.storage.get(clientId);

    if (!entry || entry.date !== today) {
      // Nouveau jour ou nouveau client
      return { allowed: true, remaining: dailyLimit };
    }

    const remaining = Math.max(0, dailyLimit - entry.count);
    return {
      allowed: remaining > 0,
      remaining,
    };
  }

  recordUsage(clientId: string): void {
    const today = this.getTodayString();
    const entry = this.storage.get(clientId);

    if (!entry || entry.date !== today) {
      this.storage.set(clientId, { count: 1, date: today });
    } else {
      entry.count++;
      this.storage.set(clientId, entry);
    }
  }

  private getTodayString(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }

  private cleanup(): void {
    const today = this.getTodayString();
    for (const [clientId, entry] of this.storage.entries()) {
      if (entry.date !== today) {
        this.storage.delete(clientId);
      }
    }
  }
}
