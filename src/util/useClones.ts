import Matter from 'matter-js';
import React, { useEffect } from 'react';
import { useEngine } from '../util';
import { useCat, Cat } from './trackCats';
import { dataKey, TrackStates } from '../bodies/Body';

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
          // TODO: optimize circles
          !body.circleRadius &&
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
        const data = body[dataKey];
        const { trackStates } = data;
        const { classList } = ref.current;
        if (trackStates.sleeping) {
          if (classList.contains(trackStates.sleeping)) {
            if (!body.isSleeping) {
              classList.remove(trackStates.sleeping);
            }
          } else if (body.isSleeping) {
            classList.add(trackStates.sleeping);
          }
        }
        const { style } = ref.current;
        if (key === svgKey) {
          // TODO: fix
          if (!clone.data) {
            clone.data = {
              lastRadius: null,
            };
          }
          const { data } = clone;
          if (data.lastRadius !== body.circleRadius) {
            // @ts-ignore
            ref.current.firstChild!.setAttribute('r', body.circleRadius);
            data.lastRadius = body.circleRadius;
          }
          style.transform = `translate(${x}px, ${y}px) rotate(${body.angle}rad)`;
        } else if (clone.key === domKey) {
          const domEl = clone.ref.current!;
          const width = domEl.offsetWidth;
          const height = domEl.offsetHeight;
          if (!clone.data) {
            clone.data = {};
          }
          const { data } = clone;
          data.lastWidth = data.lastWidth || 100;
          data.lastHeight = data.lastHeight || 100;
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

// TODO: fix types
type CloneData = {
  trackStates?: TrackStates;
  lastRadius?: number | null;
};
type Clone = {
  el: React.ReactElement;
} & (
  | {
      key: typeof domKey;
      ref: React.RefObject<HTMLElement>;
      data?: CloneData & {
        lastWidth?: number;
        lastHeight?: number;
      };
    }
  | {
      key: typeof svgKey;
      ref: React.RefObject<SVGElement>;
      data?: CloneData;
    }
);

declare module 'matter-js' {
  interface Body {
    [cloneKey]?: Clone;
    positionPrev: Matter.Vector;
  }
}
