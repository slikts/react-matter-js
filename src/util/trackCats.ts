import Matter from 'matter-js';
import { useLayoutEffect } from 'react';
import { useEngine } from '../Engine';
import DefaultMap from './DefaultMap';
import TrackSet from './TrackSet';
import { useUpdate } from '../util';

const trackCats = (engine: Matter.Engine) => {
  const map: CatMap = new DefaultMap(() => new TrackSet());
  engine[catsKey] = map;

  Matter.Events.on(engine.world, 'afterAdd', ({ object }) => {
    if (!object[catsKey]?.length) {
      return;
    }
    console.log(object[catsKey]);

    object[catsKey].forEach((key: CatKey) => void map.get(key).add(object));
  });
  Matter.Events.on(engine.world, 'afterRemove', ({ object }) => {
    if (!object[catsKey]) {
      return;
    }
    object[catsKey].forEach((key: CatKey) => void map.get(key).delete(object));
  });

  return () => {
    engine[catsKey].clear();
  };
};

export default trackCats;

export const catsKey = Symbol('categories');

export type Cat = TrackSet<Matter.Body>;
export type CatKey = string | symbol;
export type CatMap = DefaultMap<CatKey, Cat>;

export const useCat = (key: CatKey) => {
  const engine = useEngine();
  const [cat, setCat] = useUpdate(engine[catsKey].get(key));

  useLayoutEffect(() => {
    cat.track(setCat);

    return () => {
      cat.untrack(setCat);
    };
  }, []);

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
