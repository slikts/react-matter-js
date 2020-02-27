import React, { createRef } from 'react';
import Matter from 'matter-js';
import Body from './Body';
import { cloneKey, svgKey } from '../util/useClones';
import { valueMemo } from '../util';

const Rectangle = ({
  x,
  y,
  width,
  height,
  clone = false,
  options,
  ...props
}: Props) => {
  const createBody = () => {
    const body = Matter.Bodies.rectangle(x, y, width, height, options);
    if (clone) {
      const ref = createRef<SVGRectElement>();
      const el = (
        <rect
          x={-width / 2}
          y={-height / 2}
          width={width}
          height={height}
          ref={ref}
          key={body.id}
        />
      );
      body[cloneKey] = {
        key: svgKey,
        domEl: ref.current!,
        el,
      };
    }

    return body;
  };

  return <Body {...props}>{createBody}</Body>;
};

export default valueMemo(Rectangle);

type Props = {
  x: number;
  y: number;
  width: number;
  height: number;
  clone?: boolean;
  options?: Matter.IChamferableBodyDefinition;
} & Omit<React.ComponentProps<typeof Body>, 'children'>;
