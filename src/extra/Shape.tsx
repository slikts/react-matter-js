import React from 'react';
import Matter from 'matter-js';
import 'pathseg';
import Vertices from '../bodies/Vertices';
import { useSprite } from '../util/SpriteMap';

const Shape = ({ path, sampleLength = 30, ...props }: Props) => {
  const vertexSets = [Matter.Svg.pathToVertices(path, sampleLength)];
  const sprite = useSprite(path);

  console.log(sprite);

  return <Vertices cloneID={sprite} vertexSets={vertexSets} {...props} />;
};

export default Shape;

type Props = {
  path: SVGPathElement;
  sampleLength?: number;
} & React.ComponentProps<typeof Vertices>;

// @ts-ignore
window.decomp = require('poly-decomp');
