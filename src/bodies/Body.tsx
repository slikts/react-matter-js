import { useEffect } from 'react';
import Matter from 'matter-js';
import { useEngine } from '../Engine';
import { catsKey, CatKey } from '../util/trackCats';
import { cloneKey } from '../util/useClones';
import { valueMemo } from '../util';

type Props = {
  children: () => Matter.Body;
  cats?: CatKey[];
  bodyRef?: React.MutableRefObject<Matter.Body | null>;
};

const Body = ({ children: createBody, cats = [], bodyRef }: Props) => {
  const engine = useEngine();
  useEffect(() => {
    const body = createBody();

    if (bodyRef) {
      bodyRef.current = body;
    }

    body[catsKey] = cats;

    if (body[cloneKey]) {
      body[catsKey].push(body[cloneKey]!.key, cloneKey);
    }

    Matter.World.add(engine.world, body);

    return () => {
      Matter.World.remove(engine.world, body);
      if (bodyRef) {
        bodyRef.current = null;
      }
    };
  }, [engine, createBody]);

  return null;
};

export default valueMemo(Body);
