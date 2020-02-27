import React, { createRef } from 'react';
import Matter from 'matter-js';
import Body from './Body';
import { cloneKey, svgKey } from '../util/useClones';
import { valueMemo } from '../util';

const px = (n: number) => `${n}px`;

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

    const ref = createRef<SVGSVGElement>();
    const { min, max } = body.bounds;

    const _width = max.x - min.x;
    const _height = max.y - min.y;
    const scale = Math.min(width / _width, height / _height);
    Matter.Body.scale(body, scale, scale);
    // const viewBox = parseViewbox(
    //   document.querySelector(`#${cloneID}`).getAttribute("viewBox")
    // );

    // XXX: why?
    const ratio = 1.4;
    const scaledWidth = _width * scale * ratio;
    const scaledHeight = _height * scale * ratio;

    const el = (
      <g ref={ref}>
        <use
          xlinkHref={`#${cloneID}`}
          width={px(scaledWidth)}
          height={px(scaledHeight)}
          key={cloneID}
          x={px(-scaledWidth / 2)}
          y={px(-scaledHeight / 2)}
          {...cloneProps}
        />
      </g>
    );
    body[cloneKey] = {
      key: svgKey,
      domEl: ref.current!,
      el,
    };

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
  cloneID?: number;
  cloneProps: object;
} & React.ComponentProps<typeof Body>;
