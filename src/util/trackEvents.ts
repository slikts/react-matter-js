import Matter from 'matter-js';
import { CollisionMap } from './HandlerMap';

const trackEvents = (engine: Matter.Engine) => {
  const events = {
    collisionStart: new CollisionMap(engine, 'collisionStart'),
    collisionActive: new CollisionMap(engine, 'collisionActive'),
    collisionEnd: new CollisionMap(engine, 'collisionEnd'),
  };
  engine[eventsKey] = events;

  return () => {
    // TODO: cleanup events
  };
};

export default trackEvents;

export const eventsKey = Symbol('events');

declare module 'matter-js' {
  interface Engine {
    // TODO:
    [eventsKey]: any;
  }
}
