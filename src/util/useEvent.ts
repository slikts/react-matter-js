import { useEffect, DependencyList } from 'react';
import Matter from 'matter-js';
import { useEngine } from '../Engine';

const useEvent = (
  eventName: string,
  handler: (e: any) => void,
  deps: DependencyList,
) => {
  const { world } = useEngine();

  useEffect(() => {
    Matter.Events.on(world, eventName, handler);

    return () => void Matter.Events.off(world, eventName, handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

export default useEvent;

export const useIntervalEvent = (
  eventName: string,
  handler: (e: any) => void,
  interval: number,
  deps: DependencyList,
) => {
  let count = 0;

  useEvent(
    eventName,
    (...args) => {
      if (count === interval) {
        handler(...args);
        count = 0;
      }
      count += 1;
    },
    deps,
  );
};
