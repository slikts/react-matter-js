import { useEffect } from 'react';
import Matter, { Body } from 'matter-js';
import { useEngine } from '..';
import { CatKey, useCat } from './trackCats';

const useJitter = (
  catKey: CatKey,
  { drift = 0.001, angleJitter = 0.1, uprightBias = 0.01 } = {},
) => {
  const engine = useEngine();
  const cat = useCat(catKey);

  useEffect(() => {
    const afterUpdate = () => {
      cat.forEach(body => {
        const x = randomSign() * drift;
        const y = randomSign() * drift;

        Body.applyForce(body, body.position, {
          x,
          y,
        });
        const dir = (body.angle % (PI * 2)) / (PI * 2) - 0.5;
        const turn =
          ((1 - Math.abs(dir)) / 0.5 - 1) * Math.sign(dir) * uprightBias;
        body.torque = randomSign() * angleJitter + turn;
      });
    };

    Matter.Events.on(engine, 'afterUpdate', afterUpdate);

    return () => void Matter.Events.off(engine, 'afterUpdate', afterUpdate);
  }, [cat, engine, angleJitter, drift, uprightBias]);
};

export default useJitter;

const randomSign = () => Math.sign(Math.random() - 0.5);

const { PI } = Math;
