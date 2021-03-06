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
  maxSides,
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
      Matter.Bodies.circle(sizes.x, sizes.y, sizes.radius, options, maxSides),
    );
    ref.current = body;
    if (clone) {
      const ref = createRef<SVGCircleElement>();
      const el = (
        <g {...cloneProps} ref={ref} key={body.id}>
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
  }, [ref, sizes.x, sizes.y]);
  useEffect(() => {
    const body = ref.current!;
    const { circleRadius } = body;
    if (circleRadius === sizes.radius) {
      return;
    }
    const scale = sizes.radius / circleRadius!;
    Matter.Body.scale(body, scale, scale);
  }, [ref, sizes.radius]);

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
  maxSides?: number;
  cloneProps?: React.SVGProps<SVGGElement>;
} & Omit<React.ComponentProps<typeof Body>, 'children'>;
