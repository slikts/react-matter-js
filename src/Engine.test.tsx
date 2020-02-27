import React from 'react';
import { render } from '@testing-library/react';

import Engine from './Engine';

describe('Engine', () => {
  it('renders', () => {
    const { rerender } = render(<Engine options={{}}>foo</Engine>);
    rerender(
      <Engine
        options={{
          positionIterations: 5,
        }}
      >
        foo
      </Engine>,
    );
  });
});
