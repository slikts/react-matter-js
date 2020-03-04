import Matter from 'matter-js';
import HandlerMap, {
  CollisionMap,
  SleepMap,
  MouseUpMap,
  MouseMoveMap,
  MouseDownMap,
} from './HandlerMap';

const trackEvents = (engine: Matter.Engine) => {
  const mousedown = new MouseDownMap('mousedown');
  const events = {
    collisionStart: new CollisionMap('collisionStart'),
    collisionActive: new CollisionMap('collisionActive'),
    collisionEnd: new CollisionMap('collisionEnd'),
    sleepStart: new SleepMap('sleepStart'),
    sleepEnd: new SleepMap('sleepEnd'),
    mouseup: new MouseUpMap('mouseup', mousedown),
    mousemove: new MouseMoveMap('mousemove'),
    mousedown,
  };
  engine[eventsKey] = events;

  return () => {
    Object.values(events).forEach((map: HandlerMap<any, unknown, string>) => {
      map.forEach(set => void set.clear());
      map.clear();
    });
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
