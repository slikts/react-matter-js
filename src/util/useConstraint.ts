import { useRef, useLayoutEffect } from 'react';
import Matter from 'matter-js';
// import { useForwardRef } from './common';
// import { useValueEffect } from './useValue';
import { useEngine } from './engineContext';

// TODO: forward refs
// TODO: delete this
const useConstraint = (
  options: Matter.IConstraintDefinition,
  enabled: boolean = true,
) => {
  const engine = useEngine();
  const refA = useRef<Matter.Body>();
  const refB = useRef<Matter.Body>();

  useLayoutEffect(() => {
    if (!enabled) {
      return;
    }
    if (!refA.current || !refB.current) {
      console.warn('constraint bodies missing', refA, refB);
      return;
    }
    const constraint = Matter.Constraint.create({
      bodyA: refA.current!,
      bodyB: refB.current!,
      ...options,
    });

    return () => {
      Matter.World.remove(engine.world, constraint);
    };
  }, [options, enabled]);

  return { refA: refA, refB: refB };
};

export default useConstraint;
