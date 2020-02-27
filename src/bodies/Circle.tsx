/** @jsx createElement */

import { createElement } from '../util';

import { createRef } from 'react';
import Matter from 'matter-js';
import Body from './Body';
import { cloneKey, svgKey } from '../util/useClones';
import { valueMemo } from '../util';

const Circle = ({ x, y, radius, clone = false, options, ...props }: Props) => {
  const createBody = () => {
    const body = Matter.Bodies.circle(x, y, radius, options);

    if (clone) {
      const ref = createRef<SVGCircleElement>();
      const el = <circle cx={0} cy={0} r={radius} ref={ref} key={body.id} />;
      body[cloneKey] = {
        key: svgKey,
        ref,
        el,
      };
    }

    return body;
  };

  return <Body {...props}>{createBody}</Body>;
};

export default valueMemo(Circle);

type Props = {
  x: number;
  y: number;
  radius: number;
  clone?: boolean;
  options?: Matter.IBodyDefinition;
} & Omit<React.ComponentProps<typeof Body>, 'children'>;
