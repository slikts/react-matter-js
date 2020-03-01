import React, { useEffect } from 'react';
import { shallow } from 'tuplerone';
import { render } from '@testing-library/react';
import valueMemo, { valueCompare } from './valueMemo';

describe(valueMemo.name, () => {
  it('memos', () => {
    const fn = jest.fn();
    const Component = valueMemo(({ a }: any) => {
      useEffect(() => {
        fn();
      }, [a]);
      return null;
    });

    const { rerender } = render(<Component a={{ b: 1 }} />);
    rerender(<Component a={{ b: 1 }} />);
    expect(fn).toHaveBeenCalledTimes(1);
    rerender(<Component a={{ b: 2 }} />);
    expect(fn).toHaveBeenCalledTimes(2);
  });
  describe('valueCompare', () => {
    it('hangs on cyclic references', () => {
      const a: any = {};
      const b = { a };
      a.b = b;
      expect(() => void valueCompare(a, b)).toThrow();
    });

    it("doesn't hang on shallow", () => {
      const a: any = shallow({});
      const b = shallow({ a });
      a.b = b;
      expect(() => void valueCompare(a, b)).not.toThrow();
    });
  });
});
