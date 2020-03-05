import React from 'react';
import Matter from 'matter-js';
import 'pathseg';
import Vertices from '../bodies/Vertices';
import { useSprite, SpriteKey } from '../util/SpriteMap';

const Shape = ({
  clone = false,
  hull,
  sprite,
  sampleLength = 30,
  children,
  ...props
}: Props) => {
  const path =
    hull.tagName === 'path'
      ? (hull as SVGPathElement)
      : (hull.querySelector('path') as SVGPathElement);
  if (!path) {
    console.warn('invalid sprite', hull);
  }
  if (!cache.has(path)) {
    cache.set(path, Matter.Svg.pathToVertices(path, sampleLength));
  }
  const vertexSets = cache.get(path);
  const cloneID = useSprite(sprite || hull);

  return (
    <Vertices
      {...props}
      cloneID={clone ? cloneID : null}
      vertexSets={vertexSets}
    />
  );
};

export default Shape;

type Props = {
  clone?: boolean;
  hull: SpriteKey;
  sprite?: SpriteKey;
  sampleLength?: number;
  children?: React.ReactSVGElement;
} & Omit<React.ComponentProps<typeof Vertices>, 'vertexSets'>;

// @ts-ignore
window.decomp = require('poly-decomp');

const cache = new WeakMap<SVGElement, Matter.Vector[]>();
