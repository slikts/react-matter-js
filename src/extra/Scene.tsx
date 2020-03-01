import React from 'react';
import Matter from 'matter-js';
import Render from '../Render';
import Walls from './Walls';
import Engine from '../Engine';
import RenderClones from './RenderClones';
import { valueMemo, relX, relY } from '../util';
import { Sprites, loadSprites } from '../util/SpriteMap';

const Scene = ({
  width = 720,
  height = 540,
  pixelRatio = 'auto',
  engineOptions = {},
  rendererProps = {},
  mouse = true,
  gravity,
  walled = false,
  wallWidth = 50,
  sprites = [],
  children,
}: Props) => {
  const rendererOptions = {
    width,
    height,
    background: 'transparent',
    wireframeBackground: 'transparent',
    pixelRatio,
    ...rendererProps.options,
  };
  const key = `${rendererOptions.width}-${rendererOptions.height}`;
  loadSprites(sprites);

  const wall = walled ? (
    <Walls
      x={-wallWidth}
      y={-wallWidth}
      width={engine => relX(1)(engine) + wallWidth}
      height={engine => relY(1)(engine) + wallWidth}
      wallWidth={wallWidth}
      options={{
        render: {
          visible: false,
        },
      }}
    />
  ) : null;

  return (
    <Engine options={engineOptions} key={key}>
      <RenderClones
        {...rendererProps}
        options={rendererOptions}
        enableMouse={mouse}
      >
        {wall}
        {(engine: Matter.Engine) => {
          Object.assign(engine.world.gravity, gravity);

          return children;
        }}
      </RenderClones>
    </Engine>
  );
};

export default valueMemo(Scene);

type Gravity = {
  x?: number;
  y?: number;
  scale?: number;
};
type RendererProps = Omit<React.ComponentProps<typeof Render>, 'options'> & {
  options?: Matter.IRendererOptions;
};
type Props = {
  width?: number;
  height?: number;
  pixelRatio?: number | 'auto';
  engineOptions?: Matter.IEngineDefinition;
  rendererProps?: RendererProps;
  mouse?: boolean;
  gravity?: Gravity;
  walled?: boolean;
  wallWidth?: number;
  sprites?: Sprites;
  children: React.ReactNode;
};
