import { useEffect, MutableRefObject } from 'react';
import Matter, { Vector, Body } from 'matter-js';
import { useEngine } from './engineContext';

const useAttraction = (
  attractorRef: BodyRef,
  attracteeRef: BodyRef,
  { innerFriction = 1, gravityConstant = 0.001, boost = 1 }: AttrOptions = {},
) => {
  const engine = useEngine();
  const {
    render: { canvas },
  } = engine;

  useEffect(() => {
    let inside = false;

    const afterUpdate = () => {
      // Relativize attraction by the diagonal of the scene
      const diagonal = Math.sqrt(canvas.width ** 2 + canvas.height ** 2) * 1e-3;
      const { current: attractee } = attracteeRef;
      const { current: attractor } = attractorRef;
      if (!attractee || !attractor) {
        return;
      }
      const bToA = Vector.sub(attractor.position, attractee.position);
      const distance = Vector.magnitude(bToA) || 0.0001;
      const normal = Vector.normalise(bToA);
      const magnitude =
        -gravityConstant *
        (attractee.mass * 1e-4 * distance ** 2) *
        boost *
        diagonal;
      const force = Vector.mult(normal, magnitude);

      Body.applyForce(attractee, attractee.position, Matter.Vector.neg(force));
      // Dampen turn by distance to attractor
      const damp = 1 - Math.min(distance / attractor.circleRadius! / 2, 1);
      if (damp > 0.1) {
        if (!inside) {
          attractee.frictionAir = attractee.frictionAir / innerFriction;
          inside = true;
        }
        const dir = (attractee.angle % (PI * 2)) / (PI * 2) - 0.5;
        const turn = ((1 - Math.abs(dir)) / 0.5 - 1) * Math.sign(dir);
        const turnSpeed = 0.05 * turn;
        if (Math.abs(turnSpeed) > 1e-4) {
          Body.setAngularVelocity(attractee, turnSpeed * damp);
        }
      } else if (inside) {
        attractee.frictionAir = attractee.frictionAir * innerFriction;
        inside = false;
      }
    };

    Matter.Events.on(engine, 'afterUpdate', afterUpdate);

    return () => void Matter.Events.off(engine, 'afterUpdate', afterUpdate);
  }, [
    engine,
    canvas,
    attracteeRef,
    attractorRef,
    boost,
    gravityConstant,
    innerFriction,
  ]);
};

export default useAttraction;

type BodyRef = MutableRefObject<Body | undefined>;
export type AttrOptions = {
  innerFriction?: number;
  boost?: number;
  gravityConstant?: number;
};

const { PI } = Math;
