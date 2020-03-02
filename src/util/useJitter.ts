import { useEffect } from 'react';
import Matter, { Body } from 'matter-js';
import { useEngine } from './engineContext';
import { CatKey, useCat } from './trackCats';

const useJitter = (
  catKey: CatKey,
  { driftX = 1e-6, driftY = 1e-6, angleJitter = 0.1, uprightBias = 0.01 } = {},
) => {
  const engine = useEngine();
  const cat = useCat(catKey);

  useEffect(() => {
    const afterUpdate = () => {
      cat.forEach(body => {
        const x = randomSign() * driftX * engine.render.canvas.width;
        const y = randomSign() * driftY * engine.render.canvas.height;

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
  }, [cat, engine, angleJitter, driftX, driftY, uprightBias]);
};

export default useJitter;

const randomSign = () => Math.sign(Math.random() - 0.5);

const { PI } = Math;
