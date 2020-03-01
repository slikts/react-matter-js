import React, { createRef } from 'react';
import Matter from 'matter-js';
import Body from './Body';
import { cloneKey, svgKey } from '../util/useClones';
import { valueMemo } from '../util';

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
  ...props
}: Props) => {
  const createBody = () => {
    const body = Matter.Bodies.fromVertices(
      x,
      y,
      vertexSets,
      options,
      flagInternal,
    );

    const ref = createRef<SVGGElement>();
    const { min, max } = body.bounds;
    const boundWidth = max.x - min.x;
    const boundHeight = max.y - min.y;
    const scale = Math.min(width / boundWidth, height / boundHeight);
    Matter.Body.scale(body, scale, scale);

    if (cloneID) {
      // TODO: use actual pixel ratio
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

    return body;
  };

  return <Body {...props}>{createBody}</Body>;
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
