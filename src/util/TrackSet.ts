export default class TrackSet<A> extends Set<A> {
  constructor(private subs = new Set<Sub<A>>()) {
    super();
  }
  add(a: A) {
    super.add(a);

    this.subs.forEach(sub => sub(this));
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
  clear() {
    super.clear();
    this.subs.forEach(sub => sub(this));
    this.subs.clear();
  }
}

type Sub<A> = (a: TrackSet<A>) => void;
