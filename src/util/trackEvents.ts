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
    // TODO: clean up events
    // Object.entries(events).forEach(map => {});
  };
};

export default trackEvents;

export const eventsKey = Symbol('events');

declare module 'matter-js' {
  interface Engine {
    // TODO: type
    [eventsKey]: any;
  }
}
