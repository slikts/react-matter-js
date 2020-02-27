import { useEffect, cloneElement, useRef } from 'react';
import Matter from 'matter-js';
import { useEngine } from './Engine';
import { valueMemo } from './util';

// TODO: return type?
const Constraint = ({ children, length, ...options }: Props): any => {
  const engine = useEngine();

  const bodyARef = useRef();
  const bodyBRef = useRef();

  useEffect(() => {
    const { current: bodyA } = bodyARef;
    const { current: bodyB } = bodyBRef;
    const constraint = Matter.Constraint.create({
      bodyA,
      bodyB,
      length,
      ...options,
    });
    Matter.World.add(engine.world, constraint);

    return () => {
      Matter.World.remove(engine.world, constraint);
    };
  }, [options, engine, length]);

  return [bodyARef, bodyBRef].map((bodyRef, key) =>
    cloneElement(children![key], {
      bodyRef,
      key,
    }),
  );
};

type Props = {
  children: [React.ReactElement, React.ReactElement];
  length?: number;
};

export default valueMemo(Constraint);
