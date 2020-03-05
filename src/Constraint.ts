import { cloneElement, memo } from 'react';
import Matter from 'matter-js';

import { useEngine } from './util/engineContext';
import { valueCompare, useForwardRef, useValueEffect } from './util';
import { BodyRef } from './bodies/Body';

// TODO: return type
const Constraint = ({
  children,
  length,
  bodyRef,
  enabled = true,
  ...options
}: Props): any => {
  const engine = useEngine();

  const [childA, childB] = children;
  const childRef = childA.props.bodyRef;
  if (bodyRef && childRef && bodyRef !== childRef) {
    console.warn('body ref conflict');
  }
  const bodyRefA = useForwardRef(bodyRef || childRef);
  const bodyRefB = useForwardRef(childB.props.bodyRef);

  useValueEffect(() => {
    if (!enabled) {
      return;
    }
    const { current: bodyA } = bodyRefA;
    const { current: bodyB } = bodyRefB;

    const constraint = Matter.Constraint.create({
      bodyA: bodyA!,
      bodyB: bodyB!,
      length,
      ...options,
    });
    Matter.World.add(engine.world, constraint);

    return () => {
      Matter.World.remove(engine.world, constraint);
    };
  }, [options, engine, length, bodyRefA, bodyRefB, enabled]);

  return [bodyRefA, bodyRefB].map((bodyRef, key) =>
    cloneElement(children[key], {
      bodyRef,
      key,
    }),
  );
};

type Props = {
  children: [Element, Element];
  length?: number;
  bodyRef?: BodyRef;
  enabled?: boolean;
} & Matter.IConstraintDefinition;
type Element = React.ReactElement<{ bodyRef: BodyRef }>;

export default memo(Constraint, valueCompare);
