import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { Cache } from "cache-manager";

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  get<T>(key: string): Promise<T> {
    return this.cacheManager.get<T>(key);
  }

  async set(key: string, value: any, ttl: number = 1000) {
    await this.cacheManager.set(key, value, { ttl });
  }

  async reset() {
    await this.cacheManager.reset();
  }

  async del(key: string) {
    await this.cacheManager.del(key);
  }
}
