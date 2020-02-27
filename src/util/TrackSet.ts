export default class TrackSet<A> extends Set<A> {
  constructor(private subs = new Set<Sub>()) {
    super();
  }
  add(a: A) {
    super.add(a);
    this.subs.forEach(sub => sub(this));
    return this;
  }
  track(sub: Sub) {
    this.subs.add(sub);
  }
  untrack(sub: Sub) {
    this.subs.delete(sub);
  }
}

type Sub = <A>(a: A) => void;
