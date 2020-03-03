import React, { createRef } from 'react';
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
} from '../util';

const Rectangle = ({
  x,
  y,
  width,
  height,
  clone = false,
  options,
  bodyRef,
  ...props
}: Props) => {
  const rerender = useRerender();
  const ref = useForwardRef(bodyRef);
  const sizes = useMapSizes({
    x,
    y,
    width,
    height,
  });

  useValueEffect(() => {
    const { x, y, width, height } = sizes;
    const body = shallow(Matter.Bodies.rectangle(x, y, width, height, options));
    ref.current = body;
    if (clone) {
      const ref = createRef<SVGRectElement>();
      const el = (
        <g ref={ref} key={body.id}>
          <rect x={-width / 2} y={-height / 2} width={width} height={height} />
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

  return ref.current ? (
    <Body {...props} bodyRef={ref} key={ref.current.id} />
  ) : null;
};

export default valueMemo(Rectangle);

type Props = {
  x: number;
  y: number;
  width: number;
  height: number;
  clone?: boolean;
  options?: Matter.IChamferableBodyDefinition;
} & React.ComponentProps<typeof Body>;
