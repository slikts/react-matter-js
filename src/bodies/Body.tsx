import { useEffect } from 'react';
import Matter from 'matter-js';
import { useEngine } from '../Engine';
import { catsKey, CatKey } from '../util/trackCats';
import { cloneKey } from '../util/useClones';
import { valueMemo } from '../util';

type Props = {
  children: () => Matter.Body;
  cats?: CatKey[];
  // bodyRef?: React.MutableRefObject<Matter.Body>;
};

const Body = ({ children: createBody, cats = [] }: Props) => {
  const engine = useEngine();
  useEffect(() => {
    const body = createBody();

    body[catsKey] = cats;

    if (body[cloneKey]) {
      body[catsKey].push(body[cloneKey]!.key, cloneKey);
    }

    Matter.World.add(engine.world, body);

    return () => {
      Matter.World.remove(engine.world, body);
    };
  }, [engine, createBody]);

  return null;
};

export default valueMemo(Body);
