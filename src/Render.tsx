import React, { useRef, useState } from 'react';
import Matter from 'matter-js';
import { shallow } from 'tuplerone';

import { valueMemo, useValueEffect, useEngine } from './util';
import { css } from 'emotion';

const Render = ({
  options,
  enableMouse = false,
  mouseConstraintOptions,
  children,
  ...props
}: Props) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const engine = useEngine();
  const [render, setRender] = useState<Matter.Render | null>(null);
  const { width } = options;

  useValueEffect(() => {
    const render = shallow(
      Matter.Render.create({
        element: elementRef.current!,
        engine,
        options,
      }),
    );
    engine.render = render;
    setRender(render);
    Matter.Render.run(render);

    const runner = shallow(Matter.Runner.create());
    Matter.Runner.run(runner, engine);

    if (enableMouse || mouseConstraintOptions) {
      const mouse = shallow(Matter.Mouse.create(render.canvas));
      const mouseConstraint = shallow(
        Matter.MouseConstraint.create(engine, {
          ...mouseConstraintOptions,
          mouse,
        }),
      );
      Matter.World.add(engine.world, mouseConstraint);
    }

    return () => {
      Matter.Render.stop(render);
      render.canvas.remove();
      // @ts-ignore
      render.canvas = null;
      // @ts-ignore
      render.context = null;
      Matter.Runner.stop(runner);
      render.textures = {};
    };
  }, [engine, options, mouseConstraintOptions, enableMouse, setRender]);

  return (
    <div
      {...props}
      ref={elementRef}
      className={css`
        display: block;
        width: ${width}px;
        position: relative;
        canvas {
          position: relative;
          display: block;
          z-index: 1;
        }
      `}
    >
      {render ? renderChildren(children, engine) : null}
    </div>
  );
};

export default valueMemo(Render);

type Props = {
  options: Matter.IRendererOptions;
  enableMouse?: boolean;
  mouseConstraintOptions?: Matter.IMouseConstraintDefinition;
  children?: React.ReactNode;
};

type RenderFn = (engine: Matter.Engine) => React.ReactNode;
const renderChildren = (
  children: React.ReactNode | RenderFn,
  engine: Matter.Engine,
): React.ReactNode => {
  if (Array.isArray(children)) {
    return children.map(child => renderChildren(child, engine));
  }
  return typeof children === 'function' ? children(engine) : children;
};
