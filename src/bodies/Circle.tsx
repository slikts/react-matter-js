import React, { createRef } from 'react';
import Matter from 'matter-js';
import Body from './Body';
import { cloneKey, svgKey } from '../util/useClones';
import { valueMemo, Size, useMapSizes } from '../util';

const Circle = ({
  x,
  y,
  radius,
  clone = false,
  options,
  cloneProps,
  ...props
}: Props) => {
  const sizes = useMapSizes({
    x,
    y,
    radius,
  });
  const createBody = () => {
    const body = Matter.Bodies.circle(sizes.x, sizes.y, sizes.radius, options);

    if (clone) {
      const ref = createRef<SVGCircleElement>();
      const el = (
        <circle
          cx={0}
          cy={0}
          r={sizes.radius}
          ref={ref}
          key={body.id}
          {...cloneProps}
        />
      );
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
  x: Size;
  y: Size;
  radius: Size;
  clone?: boolean;
  options?: Matter.IBodyDefinition;
  cloneProps?: any;
} & Omit<React.ComponentProps<typeof Body>, 'children'>;
