import React from 'react';
import Matter from 'matter-js';
import Render from '../Render';

import Engine from '../Engine';
import RenderClones from './RenderClones';
import { valueMemo } from '../util';

const Scene = ({
  width = 720,
  height = 540,
  pixelRatio = 'auto',
  engineOptions = {},
  rendererProps = {},
  mouse = true,
  gravity,
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
  const engineKey = `${rendererOptions.width}-${rendererOptions.height}`;

  return (
    <Engine options={engineOptions} key={engineKey}>
      <RenderClones
        {...rendererProps}
        options={rendererOptions}
        enableMouse={mouse}
      >
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
  children: React.ReactNode;
};
