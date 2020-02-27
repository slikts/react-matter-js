import { useEffect } from 'react';
import Matter from 'matter-js';
import { useEngine } from '../Engine';
import { catsKey, CatKey } from '../util/trackCats';
import { cloneKey } from '../util/useClones';

type Props = {
  children: () => Matter.Body;
  cats?: CatKey[];
  bodyRef?: React.MutableRefObject<Matter.Body>;
};

const Body = ({ children: createBody, cats = [], bodyRef }: Props) => {
  const engine = useEngine();
  useEffect(() => {
    const body = createBody();

    if (bodyRef) {
      bodyRef.current = body;
    }
    Matter.World.add(engine.world, body);

    body[catsKey] = cats;

    if (body[cloneKey]) {
      body[catsKey].push(body[cloneKey]!.key, cloneKey);
    }

    return () => {
      Matter.World.remove(engine.world, body);
      if (bodyRef) {
        bodyRef.current = body;
      }
    };
  }, [engine, createBody, bodyRef]);

  return null;
};

export default Body;
