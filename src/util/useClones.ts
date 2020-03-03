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
        const clone = body[cloneKey]!;
        const { ref, key } = clone;
        // TODO: why is this needed?
        if (!ref.current) {
          return;
        }
        const { style } = ref.current;
        if (key === svgKey) {
          style.transform = `translate(${x}px, ${y}px) rotate(${body.angle}rad)`;
        } else if (clone.key === domKey) {
          const domEl = clone.ref.current!;
          const width = domEl.offsetWidth;
          const height = domEl.offsetHeight;
          if (!clone.data) {
            clone.data = {
              lastWidth: 100,
              lastHeight: 100,
            };
          }
          const { data } = clone;
          const { lastWidth, lastHeight } = data;
          if (width !== lastWidth || height !== lastHeight) {
            const scaleX = width / lastWidth;
            const scaleY = height / lastHeight;
            Matter.Body.scale(body, scaleX, scaleY);
            data.lastWidth = lastWidth * scaleX;
            data.lastHeight = lastHeight * scaleY;
          }
          style.transform = `translate(${x - width / 2}px, ${y -
            height / 2}px) rotate(${body.angle}rad)`;
        }
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
      data?: {
        lastWidth: number;
        lastHeight: number;
      };
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
