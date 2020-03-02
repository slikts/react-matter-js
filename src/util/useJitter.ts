import { useEffect } from 'react';
import Matter, { Body } from 'matter-js';
import { useEngine } from '..';
import { CatKey, useCat } from './trackCats';

const useJitter = (catKey: CatKey) => {
  const engine = useEngine();
  const cat = useCat(catKey);

  useEffect(() => {
    const afterUpdate = () => {
      cat.forEach(body => {
        const d = 0.001;
        const x = randomSign() * d;
        const y = randomSign() * d;

        Body.applyForce(body, body.position, {
          x,
          y,
        });
        body.torque = randomSign() * 0.1;
      });
    };

    Matter.Events.on(engine, 'afterUpdate', afterUpdate);

    return () => void Matter.Events.off(engine, 'afterUpdate', afterUpdate);
  }, [cat, engine]);
};

export default useJitter;

const randomSign = () => Math.sign(Math.random() - 0.5);
