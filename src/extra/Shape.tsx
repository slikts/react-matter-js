import React, { useMemo } from 'react';
import Matter from 'matter-js';
import 'pathseg';
import Vertices from '../bodies/Vertices';
import { useSprite } from '../util/SpriteMap';

const Shape = ({ clone = false, path, sampleLength = 30, ...props }: Props) => {
  const vertexSets = useMemo(
    () => [Matter.Svg.pathToVertices(path, sampleLength)],
    [path, sampleLength],
  );
  const sprite = useSprite(path);

  return (
    <Vertices
      cloneID={clone ? sprite : null}
      vertexSets={vertexSets}
      {...props}
    />
  );
};

export default Shape;

type Props = {
  clone?: boolean;
  path: SVGPathElement;
  sampleLength?: number;
} & React.ComponentProps<typeof Vertices>;

// @ts-ignore
window.decomp = require('poly-decomp');
