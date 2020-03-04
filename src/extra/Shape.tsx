import React, { useMemo } from 'react';
import Matter from 'matter-js';
import 'pathseg';
import Vertices from '../bodies/Vertices';
import { useSprite, SpriteKey } from '../util/SpriteMap';

const Shape = ({
  clone = false,
  sprite,
  sampleLength = 30,
  children,
  ...props
}: Props) => {
  const path =
    sprite.tagName === 'path' ? sprite : sprite.querySelector('path');
  if (!path) {
    console.warn('invalid sprite', sprite);
  }
  const vertexSets = useMemo(
    () => [Matter.Svg.pathToVertices(path as SVGPathElement, sampleLength)],
    [path, sampleLength],
  );

  const cloneID = useSprite(sprite);

  return (
    <Vertices
      cloneID={clone ? cloneID : null}
      vertexSets={vertexSets}
      {...props}
    />
  );
};

export default Shape;

type Props = {
  clone?: boolean;
  sprite: SpriteKey;
  sampleLength?: number;
  children?: React.ReactSVGElement;
} & React.ComponentProps<typeof Vertices>;

// @ts-ignore
window.decomp = require('poly-decomp');
