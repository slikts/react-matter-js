import Matter from 'matter-js';
import DefaultMap from './DefaultMap';

export type CollisionHandler = (
  collider: Matter.Body,
  collidee: Matter.Body,
  e: Matter.IEventCollision<Matter.Engine>,
) => void;

// TODO: B type
class HandlerMap<A, B extends any, C extends string> extends DefaultMap<
  Matter.Body,
  Set<B>
> {
  constructor(
    private engine: Matter.Engine,
    private eventName: C,
    private handle: (event: A) => void,
  ) {
    super(() => new Set());
  }

  on(body: Matter.Body, handler: B) {
    if (!this.size) {
      Matter.Events.on(this.engine, this.eventName, this.handle);
    }
    super.get(body).add(handler);
  }

  off(body: Matter.Body, handler: B) {
    const handlers = this.get(body);
    handlers.delete(handler);
    if (!handlers.size) {
      super.delete(body);
    }
    if (!this.size) {
      Matter.Events.off(this.engine, this.eventName, this.handle);
    }
  }
}

export default HandlerMap;

type CollisionEvents = 'collisionStart' | 'collisionActive' | 'collisionEnd';
export class CollisionMap extends HandlerMap<
  Matter.IEventCollision<Matter.Engine>,
  any,
  CollisionEvents
> {
  constructor(engine: Matter.Engine, eventName: CollisionEvents) {
    super(
      engine,
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
