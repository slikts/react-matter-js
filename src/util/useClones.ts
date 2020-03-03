import Matter from 'matter-js';
import React, { useEffect } from 'react';
import { useEngine } from '../util';
import { useCat, Cat } from './trackCats';

const useClones = () => {
  const engine = useEngine();
  const bodies = useCat(cloneKey);
  const dom = pickEls(useCat(domKey));
  const svg = pickEls(useCat(svgKey));

  useEffect(() => {
    const afterUpdate = () => {
      bodies.forEach(body => {
        const { x, y } = body.position;
        if (
          body.isSleeping &&
          body.positionPrev.x === x &&
          body.positionPrev.y === y
        ) {
          return;
        }
        const { ref } = body[cloneKey]!;

        // TODO: why is this needed?
        if (!ref.current) {
          return;
        }
        ref.current.style.transform = `translate(${x}px, ${y}px) rotate(${body.angle}rad)`;
      });
    };
    Matter.Events.on(engine, 'afterUpdate', afterUpdate);
    return () => {
      Matter.Events.off(engine, 'afterUpdate', afterUpdate);
    };
  }, [bodies, engine]);

  return { dom, svg };
};

export default useClones;

const pickEls = (cat: Cat) => Array.from(cat, body => body[cloneKey]!.el);

export const cloneKey = Symbol('clone');
export const svgKey = Symbol('SVG clone');
export const domKey = Symbol('DOM clone');

type Clone = {
  el: React.ReactElement;
} & (
  | {
      key: typeof domKey;
      ref: React.RefObject<HTMLElement>;
    }
  | {
      key: typeof svgKey;
      ref: React.RefObject<SVGElement>;
    }
);

declare module 'matter-js' {
  interface Body {
    [cloneKey]?: Clone;
    positionPrev: Matter.Vector;
  }
}
