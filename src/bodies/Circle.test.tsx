import React from 'react';
import { render } from '@testing-library/react';

import Circle from './Circle';

jest.mock('../Engine', () => ({
  useEngine: () => ({}),
}));

jest.mock('matter-js', () => ({
  World: {
    add() {},
    remove() {},
  },
  Bodies: {
    circle: () => ({}),
  },
}));

describe('Circle', () => {
  it('renders', () => {
    render(<Circle x={0} y={0} radius={10} />);
    expect(1).toBe(2);
  });
});
