import { useEffect } from 'react';
import Matter from 'matter-js';
import { shallow } from 'tuplerone';
import { useEngine } from '../Engine';
import { catsKey, CatKey } from '../util/trackCats';
import { cloneKey } from '../util/useClones';
import { valueMemo, Sizes } from '../util';

const Body = ({
  children: createBody,
  cats = [],
  bodyRef,
  sizes = {},
}: Props) => {
  const engine = useEngine();
  useEffect(() => {
    const body = shallow(createBody());
    body[sizesKey] = sizes;

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
        bodyRef.current = undefined;
      }
    };
  }, [engine, createBody, cats, bodyRef, sizes]);

  return null;
};

export default valueMemo(Body);

type Props = {
  children: () => Matter.Body;
  cats?: CatKey[];
  bodyRef?: BodyRef;
  sizes?: Sizes;
};
export type BodyRef = React.MutableRefObject<Matter.Body | undefined>;

export const sizesKey = Symbol('sizes');

declare module 'matter-js' {
  interface Body {
    [sizesKey]: Sizes;
  }
}
