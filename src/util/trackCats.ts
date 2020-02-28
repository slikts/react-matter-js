import Matter from 'matter-js';
import { useLayoutEffect } from 'react';
import { useEngine } from '../Engine';
import DefaultMap from './DefaultMap';
import TrackSet from './TrackSet';
import { useRerender } from '../util';

const trackCats = (engine: Matter.Engine) => {
  const cats: CatMap = new DefaultMap(() => new TrackSet());
  engine[catsKey] = cats;

  const afterAdd = ({ object: body }: { object: Matter.Body }) => {
    if (!body[catsKey]?.length) {
      return;
    }
    body[catsKey].forEach((key: CatKey) => void cats.get(key).add(body));
  };
  const afterRemove = ({ object: body }: { object: Matter.Body }) => {
    if (!body[catsKey]) {
      return;
    }
    body[catsKey].forEach((key: CatKey) => void cats.get(key).delete(body));
  };

  Matter.Events.on(engine.world, 'afterAdd', afterAdd);
  Matter.Events.on(engine.world, 'afterRemove', afterRemove);

  return () => {
    Matter.Events.off(engine.world, 'afterAdd', afterAdd);
    Matter.Events.off(engine.world, 'afterRemove', afterRemove);
    cats.forEach(cat => void cat.clear());
    cats.clear();
  };
};

export default trackCats;

export const catsKey = Symbol('categories');

export type Cat = TrackSet<Matter.Body>;
export type CatKey = string | symbol;
export type CatMap = DefaultMap<CatKey, Cat>;

export const useCat = (key: CatKey) => {
  const engine = useEngine();
  const rerender = useRerender();
  const cat = engine[catsKey].get(key);

  useLayoutEffect(() => {
    cat.track(rerender);

    return () => {
      cat.untrack(rerender);
    };
  }, [cat, rerender]);

  return cat;
};

declare module 'matter-js' {
  interface Engine {
    [catsKey]: CatMap;
  }

  interface Body {
    [catsKey]: CatKey[];
  }
}
