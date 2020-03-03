import Matter from 'matter-js';
import { CollisionMap, SleepMap, MouseMap } from './HandlerMap';

const trackEvents = (engine: Matter.Engine) => {
  const events = {
    collisionStart: new CollisionMap('collisionStart'),
    collisionActive: new CollisionMap('collisionActive'),
    collisionEnd: new CollisionMap('collisionEnd'),
    sleepStart: new SleepMap('sleepStart'),
    sleepEnd: new SleepMap('sleepEnd'),
    mouseup: new MouseMap('mouseup'),
    mousemove: new MouseMap('mousemove'),
    mousedown: new MouseMap('mousedown'),
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
