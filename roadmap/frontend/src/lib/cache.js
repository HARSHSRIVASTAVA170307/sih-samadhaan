// Simple in-memory cache with TTL
class Cache {
  constructor() {
    this.data = {}
  }

  set(key, value, ttlMinutes = 5) {
    this.data[key] = {
      value,
      expiresAt: Date.now() + ttlMinutes * 60 * 1000
    }
  }

  get(key) {
    const item = this.data[key]
    if (!item) return null
    
    if (Date.now() > item.expiresAt) {
      delete this.data[key]
      return null
    }
    
    return item.value
  }

  clear(key) {
    delete this.data[key]
  }

  clearAll() {
    this.data = {}
  }
}

export const cache = new Cache()
