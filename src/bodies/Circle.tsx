import React, { createRef, useEffect } from 'react';
import Matter from 'matter-js';
import { shallow } from 'tuplerone';
import Body from './Body';
import { cloneKey, svgKey } from '../util/useClones';
import {
  valueMemo,
  useValueEffect,
  useForwardRef,
  useRerender,
  useMapSizes,
  Size,
} from '../util';

const Circle = ({
  x,
  y,
  radius,
  clone = false,
  options,
  cloneProps,
  bodyRef,
  ...props
}: Props) => {
  const sizes = useMapSizes({
    x,
    y,
    radius,
  });
  const rerender = useRerender();
  const ref = useForwardRef(bodyRef);

  useValueEffect(() => {
    const body = shallow(
      Matter.Bodies.circle(sizes.x, sizes.y, sizes.radius, options),
    );
    ref.current = body;
    if (clone) {
      const ref = createRef<SVGCircleElement>();
      const el = (
        <g ref={ref} key={body.id} {...cloneProps}>
          <circle cx={0} cy={0} r={sizes.radius} />
        </g>
      );
      body[cloneKey] = {
        key: svgKey,
        ref,
        el,
      };
    }

    rerender();
  }, [options]);
  useEffect(() => {
    const body = ref.current!;
    Matter.Body.setPosition(body, { x: sizes.x, y: sizes.y });
  }, [x, y, ref, sizes.x, sizes.y]);

  return ref.current ? (
    <Body {...props} bodyRef={ref} key={ref.current.id} />
  ) : null;
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
