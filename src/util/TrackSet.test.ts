import TrackSet from './TrackSet';

describe(TrackSet.name, () => {
  it('tracks', () => {
    const set = new TrackSet<number>();
    const fn = jest.fn();
    set.track(fn);
    set.add(1);
    set.add(2);
    expect(fn).toHaveBeenNthCalledWith(1, set);
    expect(fn).toHaveBeenNthCalledWith(2, set);
  });
});
