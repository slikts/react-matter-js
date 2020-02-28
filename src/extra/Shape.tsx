import React from 'react';
import Matter from 'matter-js';
import Vertices from '../bodies/Vertices';
import 'pathseg';

const Shape = ({ paths, sampleLength = 30, ...props }: Props) => {
  if (!paths) {
    return null;
  }

  const vertexSets = paths.map(path =>
    Matter.Svg.pathToVertices(path, sampleLength),
  );

  return <Vertices vertexSets={vertexSets} {...props} />;
};

export default Shape;

type Props = {
  paths: SVGPathElement[];
  sampleLength?: number;
} & React.ComponentProps<typeof Vertices>;

// @ts-ignore
window.decomp = require('poly-decomp');
