import { useEffect, MutableRefObject } from 'react';
import Matter, { Vector, Body } from 'matter-js';
import { useEngine } from '..';

const useAttraction = (
  attractorRef: BodyRef,
  attracteeRef: BodyRef,
  { innerFriction = 1, gravityConstant = 0.001, boost = 1.5 } = {},
) => {
  const engine = useEngine();

  useEffect(() => {
    let inside = false;

    const afterUpdate = () => {
      const { current: targetBody } = attracteeRef;
      const { current: sourceBody } = attractorRef;
      if (!targetBody || !sourceBody) {
        return;
      }
      const bToA = Vector.sub(sourceBody.position, targetBody.position);
      const distance = Vector.magnitude(bToA) || 0.0001;
      const normal = Vector.normalise(bToA);
      const magnitude =
        -gravityConstant * (targetBody.mass * 1e-4 * distance ** 2) * boost;
      const force = Vector.mult(normal, magnitude);

      Body.applyForce(
        targetBody,
        targetBody.position,
        Matter.Vector.neg(force),
      );
      if (distance < sourceBody.circleRadius!) {
        if (!inside) {
          targetBody.frictionAir = targetBody.frictionAir / innerFriction;
          inside = true;
        }
        const { PI } = Math;
        const dir = (targetBody.angle % (PI * 2)) / (PI * 2) - 0.5;
        const turn = ((1 - Math.abs(dir)) / 0.5 - 1) * Math.sign(dir);
        const turnSpeed = 0.05 * turn;
        if (Math.abs(turnSpeed) > 1e-4) {
          Body.setAngularVelocity(targetBody, turnSpeed);
        }
      } else if (inside) {
        targetBody.frictionAir = targetBody.frictionAir * innerFriction;
        inside = false;
      }
    };

    Matter.Events.on(engine, 'afterUpdate', afterUpdate);

    return () => void Matter.Events.off(engine, 'afterUpdate', afterUpdate);
  }, [
    engine,
    attracteeRef,
    attractorRef,
    boost,
    gravityConstant,
    innerFriction,
  ]);
};

export default useAttraction;

type BodyRef = MutableRefObject<Body | undefined>;
