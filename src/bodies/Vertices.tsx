import React, { createRef, useEffect } from 'react';
import Matter from 'matter-js';
import { shallow } from 'tuplerone';
import Body from './Body';
import { cloneKey, svgKey } from '../util/useClones';
import {
  valueMemo,
  useForwardRef,
  useValueEffect,
  useRerender,
  Size,
  useMapSizes,
} from '../util';

const Vertices = ({
  x,
  y,
  width,
  height,
  vertexSets,
  options = {},
  flagInternal = false,
  cloneID,
  cloneProps = {},
  bodyRef,
  ...props
}: Props) => {
  const ref = shallow(useForwardRef(bodyRef));
  const rerender = useRerender();
  const sizes = useMapSizes({
    x,
    y,
    width,
    height,
  });

  useValueEffect(() => {
    const { x, y, width, height } = sizes;
    const body = shallow(
      Matter.Bodies.fromVertices(x, y, vertexSets, options, flagInternal),
    );
    ref.current = body;

    const { min, max } = body.bounds;
    const boundWidth = max.x - min.x;
    const boundHeight = max.y - min.y;
    const scale = Math.min(width / boundWidth, height / boundHeight);
    Matter.Body.scale(body, scale, scale);

    if (cloneID) {
      const ref = createRef<SVGGElement>();
      // TODO: use actual pixel ratio (?)
      const ratio = 1;
      const scaledWidth = boundWidth * scale * ratio;
      const scaledHeight = boundHeight * scale * ratio;

      const el = (
        <g ref={ref} key={body.id} {...cloneProps}>
          <use
            xlinkHref={`#${cloneID}`}
            width={px(scaledWidth)}
            height={px(scaledHeight)}
            x={px(-scaledWidth / 2)}
            y={px(-scaledHeight / 2)}
          />
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
  }, [sizes.x, sizes.y, ref]);

  return ref.current ? (
    <Body {...props} bodyRef={ref} key={ref.current.id} />
  ) : null;
};

export default valueMemo(Vertices);

type Props = {
  x: Size;
  y: Size;
  width: number;
  height: number;
  vertexSets?: any;
  options?: object;
  flagInternal?: boolean;
  cloneID?: string | null;
  cloneProps?: object;
} & React.ComponentProps<typeof Body>;

const px = (n: number) => `${n}px`;
