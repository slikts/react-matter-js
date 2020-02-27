import React, { useEffect } from 'react';
import { render } from '@testing-library/react';
import valueMemo from './valueMemo';

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
});
