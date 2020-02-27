import DefaultMap from './DefaultMap';

describe(DefaultMap.name, () => {
  it('gets', () => {
    const map = new DefaultMap<string, number>((_: string) => 123);
    expect(map.get('foo')).toBe(123);
    map.set('bar', 345);
    expect(map.get('bar')).toBe(345);
  });
});
