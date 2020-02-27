import React, { useEffect } from 'react';
import { valueMemo } from './util';
import { render } from '@testing-library/react';

describe('util', () => {
  describe('valueMemo', () => {
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
});
