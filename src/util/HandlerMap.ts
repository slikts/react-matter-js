import Matter from 'matter-js';
import DefaultMap from './DefaultMap';

// TODO: B type
class HandlerMap<A, B extends any, C extends string> extends DefaultMap<
  Matter.Body,
  Set<B>
> {
  constructor(private eventName: C, private handle: (event: A) => void) {
    super(() => new Set());
  }

  on(body: Matter.Body, target: Matter.Body | Matter.Engine, handler?: B) {
    if (!handler) {
      return;
    }
    if (!this.size) {
      Matter.Events.on(target, this.eventName, this.handle);
    }
    super.get(body).add(handler);
  }

  off(body: Matter.Body, target: Matter.Body | Matter.Engine, handler?: B) {
    if (!handler) {
      return;
    }
    const handlers = this.get(body);
    handlers.delete(handler);
    if (!handlers.size) {
      super.delete(body);
    }
    if (!this.size) {
      Matter.Events.off(target, this.eventName, this.handle);
    }
  }
}

export default HandlerMap;

export type CollisionHandler = (
  collider: Matter.Body,
  collidee: Matter.Body,
  e: Matter.IEventCollision<Matter.Engine>,
) => void;

export class CollisionMap extends HandlerMap<
  Matter.IEventCollision<Matter.Engine>,
  any,
  CollisionEvents
> {
  constructor(eventName: CollisionEvents) {
    super(
      eventName,
      event =>
        void event.pairs.forEach(({ bodyA, bodyB }) => {
          if (this.has(bodyA)) {
            this.get(bodyA).forEach(
              handler => void handler(bodyA, bodyB, event),
            );
          }
          if (this.has(bodyB)) {
            this.get(bodyB).forEach(
              handler => void handler(bodyB, bodyA, event),
            );
          }
        }),
    );
  }
}

type CollisionEvents = 'collisionStart' | 'collisionActive' | 'collisionEnd';

export class SleepMap extends HandlerMap<
  Matter.IEvent<Matter.Body>,
  any,
  'sleepStart' | 'sleepEnd'
> {
  constructor(eventName: SleepEvents) {
    super(
      eventName,
      event => void this.get(event.source).forEach(handler => handler(event)),
    );
  }
}

type SleepEvents = 'sleepStart' | 'sleepEnd';

export class MouseMoveMap extends HandlerMap<MouseEvent, any, MouseEvents> {
  constructor(eventName: MouseEvents) {
    super(
      eventName,
      event =>
        void this.get(event.source.body).forEach(handler => handler(event)),
    );
  }
}
export class MouseDownMap extends HandlerMap<MouseEvent, any, MouseEvents> {
  public lastDown: Matter.Body | null = null;

  constructor(eventName: MouseEvents) {
    super(eventName, event => {
      const { body } = event.source;
      this.lastDown = body;
      this.get(body).forEach(handler => handler(event));
    });
  }
}
export class MouseUpMap extends HandlerMap<MouseEvent, any, MouseEvents> {
  constructor(eventName: MouseEvents, downMap: MouseDownMap) {
    super(eventName, event => {
      const body = downMap.lastDown;
      downMap.lastDown = null;
      if (body) {
        this.get(body).forEach(handler => handler(event));
      }
    });
  }
}
type MouseEvent = {
  mouse: Matter.Mouse;
  name: MouseEvents;
  source: Matter.MouseConstraint & {
    events: any[];
    element: any | null;
  };
};

type MouseEvents = 'mousedown' | 'mousemove' | 'mouseup';
