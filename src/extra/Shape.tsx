/** @jsx createElement */

import { createElement } from '../util';

import Matter from 'matter-js';
import Vertices from '../bodies/Vertices';

type Props = {
  paths: SVGPathElement[];
  sampleLength?: number;
} & React.ComponentProps<typeof Vertices>;

const Shape = ({ paths, sampleLength = 30, ...props }: Props) => {
  if (!paths) {
    return null;
  }

  const vertexSets = paths.map(path =>
    Matter.Svg.pathToVertices(path, sampleLength)
  );

  return <Vertices vertexSets={vertexSets} {...props} />;
};

export default Shape;
