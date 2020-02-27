import React from 'react';
import { render } from '@testing-library/react';

import Body from './Body';

jest.mock('../Engine', () => ({
  useEngine: () => ({}),
}));

jest.mock('matter-js');

describe('Body', () => {
  it('renders', () => {
    const fn = jest.fn(() => ({} as any));
    render(<Body>{fn}</Body>);
    expect(fn).toHaveBeenCalled();
  });
});
