import Matter from 'matter-js';
import React, { useEffect } from 'react';
import { useEngine } from '../Engine';
import { useCat } from './useTrackCats';

const useClones = () => {
  const engine = useEngine();
  const bodies = useCat(cloneKey);
  const dom = useCat('domClone');
  const svg = useCat('domClone');

  useEffect(() => {
    Matter.Events.on(engine, 'afterUpdate', () => {
      bodies.forEach(body => {
        if (body.isSleeping) {
          return;
        }

        const { x, y } = body.position!;
        const clone = body[cloneKey].ref.current;

        clone.style.transform = `translate(${x}px, ${y}px) rotate(${body.angle}rad)`;
      });
    });
  }, []);

  return { dom, svg };
};

export default useClones;

export const cloneKey = Symbol('clone');

declare module 'matter-js' {
  interface Body {
    [cloneKey]: {
      ref: React.MutableRefObject<HTMLElement>;
    };
  }
}
