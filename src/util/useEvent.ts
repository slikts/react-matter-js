import { useEffect, DependencyList } from 'react';
import Matter from 'matter-js';
import { useEngine } from '../util/engineContext';
import { useValueEffect } from '../util';

const useEvent = (
  eventName: string,
  handler: (e: any) => void,
  deps: DependencyList,
  valueEffect: boolean = false,
) => {
  const { world } = useEngine();

  (valueEffect ? useValueEffect : useEffect)(() => {
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
  valueEffect: boolean = false,
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
    valueEffect,
  );
};
