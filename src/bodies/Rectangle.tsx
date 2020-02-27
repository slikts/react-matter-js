import React, { createRef, useCallback } from 'react';
import Matter from 'matter-js';
import { ValueObject } from 'tuplerone';
import Body from './Body';
import { randomSuffix } from '../util';

type Props = {
  x: number;
  y: number;
  width: number;
  height: number;
  clone?: boolean;
  options?: Matter.IChamferableBodyDefinition;
} & Omit<React.ComponentProps<typeof Body>, 'children'>;

const Rectangle = ({
  x,
  y,
  width,
  height,
  clone = false,
  options = ValueObject({}),
  ...props
}: Props) => {
  const createBody = useCallback(() => {
    const body = Matter.Bodies.rectangle(x, y, width, height, options);
    if (clone) {
      const ref = createRef<SVGRectElement>();
      const svg = (
        <rect
          x={-width / 2}
          y={-height / 2}
          width={width}
          height={height}
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
  }, [clone, height, options, width, x, y]);

  return <Body {...props}>{createBody}</Body>;
};

export default Rectangle;
