import Matter from 'matter-js';
import { shallow } from 'tuplerone';
import { catsKey, CatKey } from '../util/trackCats';
import { cloneKey } from '../util/useClones';
import {
  valueMemo,
  Sizes,
  useValueEffect,
  useEngine,
  useForwardRef,
} from '../util';
import { eventsKey } from '../util/trackEvents';

const Body = ({
  children: createBody,
  cats = [],
  bodyRef,
  onCollisionStart,
  onCollisionActive,
  onCollisionEnd,
}: Props) => {
  const engine = useEngine();
  const events = engine[eventsKey];
  const ref = useForwardRef(bodyRef);

  useValueEffect(() => {
    const body = shallow(createBody());

    ref.current = body;

    body[catsKey] = Array.isArray(cats) ? new Set(cats) : cats;

    if (body[cloneKey]) {
      body[catsKey].add(body[cloneKey]!.key);
      body[catsKey].add(cloneKey);
    }

    if (onCollisionStart) {
      events.collisionStart.on(body, onCollisionStart);
    }
    if (onCollisionActive) {
      events.collisionActive.on(body, onCollisionActive);
    }
    if (onCollisionEnd) {
      events.collisionEnd.on(body, onCollisionEnd);
    }

    Matter.World.add(engine.world, body);

    return () => {
      Matter.World.remove(engine.world, body);

      ref.current = undefined;
    };
  }, [
    engine,
    createBody,
    cats,
    ref,
    onCollisionStart,
    onCollisionActive,
    onCollisionEnd,
  ]);

  return null;
};

export default valueMemo(Body);

type Props = {
  children: () => Matter.Body;
  cats?: CatKey[];
  bodyRef?: BodyRef;
  sizes?: Sizes;
  onCollisionStart?: CollisionHandler;
  onCollisionActive?: CollisionHandler;
  onCollisionEnd?: CollisionHandler;
};
export type BodyRef = React.MutableRefObject<Matter.Body | undefined>;
export type CollisionHandler = (
  e: Matter.IEventCollision<Matter.Engine>,
) => void;

export const sizesKey = Symbol('sizes');

declare module 'matter-js' {
  interface Body {
    [sizesKey]: Sizes;
  }
}
