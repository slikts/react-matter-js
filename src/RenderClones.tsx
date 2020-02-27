/** @jsx createElement */

import { createElement } from './util';

import { useEffect, useState } from 'react';
import Matter from 'matter-js';
import Render from './Render';
import { useEngine } from './Engine';
import styles from './RenderClones.module.scss';

type Props = {
  children: React.ReactNode;
  options: Matter.IRendererOptions;
  margin: number;
};

type Clones = {
  svg: Matter.Body[];
  dom: Matter.Body[];
};

const RenderClones = ({ children, options, margin = 40, ...props }: Props) => {
  const engine = useEngine();
  const { width, height } = options;
  const [bodies] = useState<Set<Matter.Body>>(new Set());
  const [clones, setClones] = useState<Clones>();

  useEffect(() => {
    const updateClones = () => {
      // TODO: make it more efficient
      const _bodies = [...bodies];
      const svg = _bodies.map(({ clone: { el } }) => el).filter(Boolean);
      const dom = _bodies.map(({ clone: { svg } }) => svg).filter(Boolean);
      setClones({
        svg,
        dom,
      });
    };
    updateClones();

    Matter.Events.on(engine.world, 'afterAdd', ({ object }) => {
      if (!object.clone) {
        return;
      }
      bodies.add(object);
      updateClones();
    });
    Matter.Events.on(engine.world, 'afterRemove', ({ object }) => {
      if (!object.clone) {
        return;
      }
      bodies.delete(object);
      updateClones();
    });
    Matter.Events.on(engine, 'afterUpdate', () => {
      for (const body of bodies) {
        if (body.isSleeping) {
          return;
        }

        const { x, y } = body.position!;
        const clone = body.clone.ref.current;

        clone.style.transform = `translate(${x}px, ${y}px) rotate(${body.angle}rad)`;
      }
    });

    return () => {
      // TODO: proper cleanup
      bodies.clear();
      updateClones();
    };
  }, [bodies, engine]);

  return (
    <Render {...props} options={options}>
      <div className={styles.domClones}>{clones?.dom}</div>
      <svg viewBox={`0 0 ${width} ${height}`} className={styles.svgClones}>
        {clones?.svg}
      </svg>
      {children}
    </Render>
  );
};

export default RenderClones;
