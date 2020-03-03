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
import { mouseConstraintKey } from '../Render';

const Body = ({
  children: createBody,
  cats = [],
  bodyRef,
  onCollisionStart,
  onCollisionActive,
  onCollisionEnd,
  onSleepStart,
  onSleepEnd,
  onMouseDown,
  onMouseMove,
  onMouseUp,
}: Props) => {
  const engine = useEngine();
  const events = engine[eventsKey];
  const ref = useForwardRef(bodyRef);

  useValueEffect(() => {
    const body = shallow(createBody());
    const mouseConstraint = engine.render[mouseConstraintKey];

    ref.current = body;

    body[catsKey] = Array.isArray(cats) ? new Set(cats) : cats;

    if (body[cloneKey]) {
      body[catsKey].add(body[cloneKey]!.key);
      body[catsKey].add(cloneKey);
    }

    events.collisionStart.on(body, engine, onCollisionStart);
    events.collisionActive.on(body, engine, onCollisionActive);
    events.collisionEnd.on(body, engine, onCollisionEnd);
    events.sleepStart.on(body, body, onSleepStart);
    events.sleepEnd.on(body, body, onSleepEnd);
    if (mouseConstraint) {
      events.mousedown.on(body, mouseConstraint, onMouseDown);
      events.mousemove.on(body, mouseConstraint, onMouseMove);
      events.mouseup.on(body, mouseConstraint, onMouseUp);
    }

    Matter.World.add(engine.world, body);

    return () => {
      events.collisionStart.off(body, engine, onCollisionStart);
      events.collisionActive.off(body, engine, onCollisionActive);
      events.collisionEnd.off(body, engine, onCollisionEnd);
      events.sleepStart.off(body, body, onSleepStart);
      events.sleepEnd.off(body, body, onSleepEnd);
      if (mouseConstraint) {
        events.mousedown.off(body, mouseConstraint, onMouseDown);
        events.mousemove.off(body, mouseConstraint, onMouseMove);
        events.mouseup.off(body, mouseConstraint, onMouseUp);
      }

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
  onSleepStart?: SleepHandler;
  onSleepEnd?: SleepHandler;
  onMouseUp?: MouseHandler;
  onMouseMove?: MouseHandler;
  onMouseDown?: MouseHandler;
};
export type BodyRef = React.MutableRefObject<Matter.Body | undefined>;
type CollisionHandler = (
  source: Matter.Body,
  target: Matter.Body,
  e: Matter.IEventCollision<Matter.Engine>,
) => void;
type SleepHandler = (e: Matter.IEvent<Matter.Body>) => void;
type MouseHandler = (e: any) => void;

export const sizesKey = Symbol('sizes');

declare module 'matter-js' {
  interface Body {
    [sizesKey]: Sizes;
  }
}
