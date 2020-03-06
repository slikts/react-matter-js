import { useRef, useEffect } from 'react';
// import { useCallbackRef, createCallbackRef } from 'use-callback-ref';

import Matter from 'matter-js';

// import { useForwardRef } from './common';
// import { useValueEffect } from './useValue';
import { useEngine } from './engineContext';
import { useForwardRef } from './common';
import { BodyRef } from 'src/bodies/Body';

// TODO: forward refs
// TODO: delete this
const useConstraint = (
  options: Matter.IConstraintDefinition,
  enabled: boolean = true,
  ref?: BodyRef,
) => {
  const engine = useEngine();
  const refA = useRef<Matter.Body>();
  const refB = useForwardRef(ref);

  useEffect(() => {
    if (!enabled || !refA.current || !refB.current) {
      return;
    }

    const constraint = Matter.Constraint.create({
      bodyA: refA.current!,
      bodyB: refB.current!,
      ...options,
    });
    Matter.World.add(engine.world, constraint);

    return () => {
      Matter.World.remove(engine.world, constraint);
    };
  }, [options, enabled, refA, refB, engine.world]);

  return { refA: refA, refB: refB };
};

export default useConstraint;
