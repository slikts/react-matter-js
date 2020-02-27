import Matter from 'matter-js';
import { useState, useEffect } from 'react';
import { useEngine } from '../Engine';
import DefaultMap from './DefaultMap';
import TrackSet from './TrackSet';

const useTrackCats = (engine?: Matter.Engine) => {
  useEffect(() => {
    if (!engine) {
      return;
    }

    const map: CatMap = new DefaultMap(() => new TrackSet());
    engine[catsKey] = map;

    Matter.Events.on(engine.world, 'afterAdd', ({ object }) => {
      if (!object[catsKey]) {
        return;
      }
      object[catsKey].forEach((key: CatKey) => void map.get(key).add(object));
    });
    Matter.Events.on(engine.world, 'afterRemove', ({ object }) => {
      if (!object[catsKey]) {
        return;
      }
      object[catsKey].forEach(
        (key: CatKey) => void map.get(key).delete(object),
      );
    });

    return () => {
      engine[catsKey].clear();
    };
  }, [engine]);
};

export default useTrackCats;

export const catsKey = Symbol('categories');

export type Cat = TrackSet<Matter.Body>;
export type CatKey = string | symbol;
export type CatMap = DefaultMap<CatKey, Cat>;

export const useCat = (key: CatKey) => {
  const engine = useEngine();
  const [cat, setCat] = useState(engine[catsKey].get(key));
  useEffect(() => {
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
    [catsKey]: Cat[];
  }
}
