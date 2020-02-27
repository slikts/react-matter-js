/** @jsx createElement */

import { createElement } from '../util';

import { createRef, useCallback } from 'react';
import Matter from 'matter-js';
import Body from './Body';
import { randomSuffix } from '../util';
import { cloneKey, svgKey } from '../util/useClones';
import { valueMemo } from '../util';

type Props = {
  x: number;
  y: number;
  radius: number;
  clone?: boolean;
  options?: Matter.IBodyDefinition;
} & Omit<React.ComponentProps<typeof Body>, 'children'>;

const Circle = ({ x, y, radius, clone = false, options, ...props }: Props) => {
  const createBody = useCallback(() => {
    const body = Matter.Bodies.circle(x, y, radius, options);

    if (clone) {
      const ref = createRef<SVGCircleElement>();
      const el = (
        <circle
          cx={-radius / 2}
          cy={-radius / 2}
          r={radius}
          ref={ref}
          key={`${body.id}__${randomSuffix}`}
        />
      );
      body[cloneKey] = {
        key: svgKey,
        domEl: ref.current!,
        el,
      };
    }

    return body;
  }, [clone, options, radius, x, y]);

  return <Body {...props}>{createBody}</Body>;
};

export default valueMemo(Circle);
