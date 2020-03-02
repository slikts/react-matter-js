export default class TrackSet<A> extends Set<A> {
  constructor(
    private subs = new Set<Sub<A>>(),
    // TODO: add cleanup (?)
    private itemSubs = new Set<ItemSub<A>>(),
  ) {
    super();
  }
  add(a: A) {
    super.add(a);
    this.subs.forEach(sub => sub(this));
    this.itemSubs.forEach(itemSub => itemSub(a));
    return this;
  }
  delete(a: A) {
    const result = super.delete(a);
    if (result) {
      this.subs.forEach(sub => sub(this));
    }
    return result;
  }
  track(sub: Sub<A>) {
    this.subs.add(sub);
  }
  untrack(sub: Sub<A>) {
    this.subs.delete(sub);
  }
  trackItems(itemSub: ItemSub<A>) {
    this.itemSubs.add(itemSub);
  }
  untrackItems(itemSub: ItemSub<A>) {
    this.itemSubs.delete(itemSub);
  }
  clear() {
    super.clear();
    this.subs.forEach(sub => sub(this));
    this.subs.clear();
  }
}

export type Sub<A> = (a: TrackSet<A>) => void;
export type ItemSub<A> = (a: A) => void;
