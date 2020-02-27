/** @jsx createElement */

import { createElement } from '../util';

import { createRef, useCallback } from 'react';
import Matter from 'matter-js';
import Body from './Body';
import { randomSuffix } from '../util';

type Props = {
  x: number;
  y: number;
  radius: number;
  clone?: any;
  options?: any;
} & Omit<React.ComponentProps<typeof Body>, 'children'>;

const Circle = ({
  x,
  y,
  radius,
  clone = false,
  options = {},
  ...props
}: Props) => {
  const createBody = useCallback(() => {
    const body = Matter.Bodies.circle(x, y, radius, options);

    if (clone) {
      const ref = createRef<SVGCircleElement>();
      const svg = (
        <circle
          cx={-radius / 2}
          cy={-radius / 2}
          r={radius}
          ref={ref}
          key={`${body.id}__${randomSuffix}`}
        />
      );
      body.clone = {
        ref,
        svg,
      };
    }

    return body;
  }, [clone, options, radius, x, y]); // TODO: memoize options

  return <Body {...props}>{createBody}</Body>;
};

export default Circle;
