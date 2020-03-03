import React, { createRef } from 'react';
import Matter from 'matter-js';
import { shallow } from 'tuplerone';
import Body from './Body';
import { cloneKey, svgKey } from '../util/useClones';
import { valueMemo, useForwardRef, useValueEffect, useRerender } from '../util';

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

  useValueEffect(() => {
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
        <g ref={ref} key={body.id}>
          <use
            xlinkHref={`#${cloneID}`}
            width={px(scaledWidth)}
            height={px(scaledHeight)}
            x={px(-scaledWidth / 2)}
            y={px(-scaledHeight / 2)}
            {...cloneProps}
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

  return ref.current ? <Body {...props} bodyRef={ref} /> : null;
};

export default valueMemo(Vertices);

type Props = {
  x: number;
  y: number;
  width: number;
  height: number;
  vertexSets: any;
  options: object;
  flagInternal: boolean;
  cloneID?: string | null;
  cloneProps: object;
} & React.ComponentProps<typeof Body>;

const px = (n: number) => `${n}px`;
