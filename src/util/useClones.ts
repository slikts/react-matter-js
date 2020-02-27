import Matter from 'matter-js';
import React, { useEffect } from 'react';
import { useEngine } from '../Engine';
import { useCat, Cat } from './trackCats';

const useClones = () => {
  const engine = useEngine();
  const bodies = useCat(cloneKey);
  const dom = pickEls(useCat(domKey));
  const svg = pickEls(useCat(svgKey));

  useEffect(() => {
    Matter.Events.on(engine, 'afterUpdate', () => {
      bodies.forEach(body => {
        if (body.isSleeping) {
          return;
        }

        const { x, y } = body.position!;
        const { domEl } = body[cloneKey]!;

        domEl.style.transform = `translate(${x}px, ${y}px) rotate(${body.angle}rad)`;
      });
    });
  }, []);

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
      domEl: HTMLElement;
    }
  | {
      key: typeof svgKey;
      domEl: SVGElement;
    }
);

declare module 'matter-js' {
  interface Body {
    [cloneKey]?: Clone;
  }
}
