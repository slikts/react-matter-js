import Matter from 'matter-js';
import { catsKey, CatKey } from '../util/trackCats';
import { cloneKey } from '../util/useClones';
import { valueMemo, Sizes, useValueEffect, useEngine } from '../util';
import { eventsKey } from '../util/trackEvents';
import { dataKey, TrackStates } from '../util/common';
import { mouseConstraintKey } from '../Render';

const Body = ({
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
  trackStates = {},
  sizes,
  data,
}: Omit<Props, 'cloneProps'>) => {
  const engine = useEngine();
  const events = engine[eventsKey];
  const body = bodyRef!.current!;

  useValueEffect(() => {
    const mouseConstraint = engine.render[mouseConstraintKey];

    body[dataKey] = { trackStates, sizes, data };
    body[catsKey] = Array.isArray(cats) ? new Set(cats) : cats;

    const clone = body[cloneKey];
    if (clone) {
      body[catsKey].add(clone.key);
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

    const { dragging } = trackStates;
    const trackDragging =
      clone && mouseConstraint && dragging
        ? {
            up: () => void clone.ref.current?.classList.remove(dragging),
            down: () => void clone.ref.current?.classList.add(dragging!),
          }
        : null;
    if (trackDragging) {
      events.mouseup.on(body, mouseConstraint, trackDragging.up);
      events.mousedown.on(body, mouseConstraint, trackDragging.down);
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
      if (trackDragging) {
        events.mouseup.off(body, mouseConstraint, trackDragging.up);
        events.mousedown.off(body, mouseConstraint, trackDragging.down);
      }
      Matter.World.remove(engine.world, body);

      bodyRef!.current = undefined;
    };
  }, [
    engine,
    cats,
    bodyRef,
    // TODO: deps
    onCollisionStart,
    onCollisionActive,
    onCollisionEnd,
  ]);

  return null;
};

export default valueMemo(Body);

type Props = {
  cats?: CatKey[];
  bodyRef?: BodyRef;
  // TODO: implement
  sizes?: Sizes;
  cloneProps?: object;
  onCollisionStart?: CollisionHandler;
  onCollisionActive?: CollisionHandler;
  onCollisionEnd?: CollisionHandler;
  onSleepStart?: SleepHandler;
  onSleepEnd?: SleepHandler;
  onMouseUp?: MouseHandler;
  onMouseMove?: MouseHandler;
  onMouseDown?: MouseHandler;
  trackStates?: TrackStates;
  data?: any;
};
export type BodyRef = React.MutableRefObject<Matter.Body | undefined>;
type CollisionHandler = (
  source: Matter.Body,
  target: Matter.Body,
  e: Matter.IEventCollision<Matter.Engine>,
) => void;
type SleepHandler = (e: Matter.IEvent<Matter.Body>) => void;
type MouseHandler = (e: any) => void;

declare module 'matter-js' {
  interface Body {
    [dataKey]: {
      trackStates: TrackStates;
      // TODO: type
      sizes: any;
      [key: string]: any;
    };
  }
}
