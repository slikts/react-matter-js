export default class DefaultMap<K, V> extends Map<K, V> {
  constructor(private init: (a: K) => V) {
    super();
  }
  get(key: K): V {
    if (!this.has(key)) {
      const value = this.init(key);
      this.set(key, value);
      return value;
    }
    return super.get(key)!;
  }
}
