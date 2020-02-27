/** @jsx createElement */

import { createElement } from './util';
import React, { useRef, useEffect } from 'react';
import Matter from 'matter-js';

import { useEngine } from './Engine';
import { valueMemo } from './util';
import styles from './Render.module.scss';

type Props = {
  options?: Matter.IRendererOptions;
  enableMouse?: boolean;
  mouseConstraintOptions?: Matter.IMouseConstraintDefinition;
  children: React.ReactNode;
};

const Render = ({
  options = {},
  enableMouse = false,
  mouseConstraintOptions,
  children,
  ...props
}: Props) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const engine = useEngine();

  useEffect(() => {
    const render = Matter.Render.create({
      element: elementRef.current!,
      engine,
      options,
    });
    Matter.Render.run(render);

    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    if (enableMouse || mouseConstraintOptions) {
      const mouse = Matter.Mouse.create(render.canvas);

      if (mouseConstraintOptions) {
        const mouseConstraint = Matter.MouseConstraint.create(engine, {
          ...mouseConstraintOptions,
          mouse,
        });
        Matter.World.add(engine.world, mouseConstraint);
      }
    }

    return () => {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
    };
  }, [engine, options, mouseConstraintOptions, enableMouse]);

  return (
    <div {...props} ref={elementRef} className={styles.Render}>
      {children}
    </div>
  );
};

export default valueMemo(Render);
