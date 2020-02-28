import { useEffect } from 'react';
import Matter from 'matter-js';
import { SerializedStyles } from '@emotion/core';
import { shallow } from 'tuplerone';
import { useEngine } from '../Engine';
import { catsKey, CatKey } from '../util/trackCats';
import { cloneKey } from '../util/useClones';
import { valueMemo } from '../util';

const Body = ({
  children: createBody,
  cats = [],
  bodyRef,
}: Omit<Props, 'cloneClass'>) => {
  const engine = useEngine();
  useEffect(() => {
    const body = shallow(createBody());

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
  }, [engine, createBody, cats, bodyRef]);

  return null;
};

export default valueMemo(Body);

type Props = {
  children: () => Matter.Body;
  cats?: CatKey[];
  bodyRef?: React.MutableRefObject<Matter.Body | null>;
  cloneClass?: string | SerializedStyles;
};
