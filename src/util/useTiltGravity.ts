import { useEffect } from 'react';
import { Common } from 'matter-js';
import { useEngine } from './engineContext';

const useTiltGravity = () => {
  const engine = useEngine();

  useEffect(() => {
    const updateGravity = (event: DeviceOrientationEvent) => {
      // TODO: doesn't work
      const orientation = window.orientation || 0;
      const { gravity } = engine.world;

      if (orientation === 0) {
        gravity.x = Common.clamp(event.gamma, -90, 90) / 90;
        gravity.y = Common.clamp(event.beta, -90, 90) / 90;
      } else if (orientation === 180) {
        gravity.x = Common.clamp(event.gamma, -90, 90) / 90;
        gravity.y = Common.clamp(-event.beta!, -90, 90) / 90;
      } else if (orientation === 90) {
        gravity.x = Common.clamp(event.beta, -90, 90) / 90;
        gravity.y = Common.clamp(-event.gamma!, -90, 90) / 90;
      } else if (orientation === -90) {
        gravity.x = Common.clamp(-event.beta!, -90, 90) / 90;
        gravity.y = Common.clamp(event.gamma, -90, 90) / 90;
      }
    };

    window.addEventListener('deviceorientation', updateGravity);

    return () =>
      void window.removeEventListener('deviceorientation', updateGravity);
  }, [engine]);
};

export default useTiltGravity;

declare module 'matter-js' {
  export const Common: any;
}
