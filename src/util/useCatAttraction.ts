import Matter from 'matter-js';
import { useEffect } from 'react';
import { useEngine } from './engineContext';
import { CatKey, catsKey } from './trackCats';

export const useCatAttraction = (
  attractorKey: CatKey,
  targetKey: CatKey,
  { gravityConstant = 1e-3, interval = 3, min = 200, max = 300 } = {},
) => {
  const engine = useEngine();
  const cats = engine[catsKey];

  const attractors = cats.get(attractorKey);
  const targets = cats.get(targetKey);

  useEffect(() => {
    let count = 0;
    const afterUpdate = () => {
      count += 1;
      if (count !== interval) {
        return;
      }
      count = 0;
      attractors.forEach(attractor => {
        targets.forEach(target => {
          const bToA = Matter.Vector.sub(target.position, attractor.position);
          const distance = Matter.Vector.magnitude(bToA);
          if (distance > max) {
            return;
          }

          const distanceSq = Matter.Vector.magnitudeSquared(bToA) || 0.0001;
          const normal = Matter.Vector.normalise(bToA);
          const magnitude =
            -gravityConstant * ((attractor.mass * target.mass) / distanceSq);
          const force = Matter.Vector.mult(normal, magnitude);

          Matter.Body.applyForce(target, target.position, force);
        });
      });
    };
    Matter.Events.on(engine, 'afterUpdate', afterUpdate);

    return () => void Matter.Events.off(engine, 'afterUpdate', afterUpdate);
  }, [attractors, engine, gravityConstant, interval, targets, max, min]);
  // const sourceCat = useCat(sourceKey);
  // const targetCat = useCat(targetKey);
};
