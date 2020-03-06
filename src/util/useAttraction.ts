import { MutableRefObject } from 'react';
import Matter, { Vector, Body } from 'matter-js';
import { useEngine } from './engineContext';
import { useValueEffect } from './useValue';

const useAttraction = (
  attractorRef: BodyRef,
  attracteeRef: BodyRef,
  updateOptions: any = {},
  makeUpdate: any = gravity,
) => {
  const engine = useEngine();

  useValueEffect(() => {
    const update = makeUpdate({
      attracteeRef,
      attractorRef,
      engine,
      ...updateOptions,
    });

    Matter.Events.on(engine, 'afterUpdate', update);

    return () => void Matter.Events.off(engine, 'afterUpdate', update);
  }, [engine, attracteeRef, attractorRef, makeUpdate, updateOptions]);
};

export default useAttraction;

type BodyRef = MutableRefObject<Body | undefined>;
// TODO: type
export type AttrOptions = {
  engine: Matter.Engine;
  [key: string]: any;
};

const { PI } = Math;

export const gravity = ({
  attracteeRef,
  attractorRef,
  engine,
  boost = 1,
  gravityConstant = 0.001,
  innerFriction = 1,
  mass,
}: AttrOptions) => {
  let inside = false;
  const {
    render: { canvas },
  } = engine;

  return () => {
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
      ((mass || attractee.mass) * 1e-4 * distance ** 2) *
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
};

// export const linear = ({ engine }: AttrOptions) => {
//   return () => {
//     //
//   };
// };
