import React, { useState, createContext, useContext, useEffect } from 'react';
import Matter from 'matter-js';

import { valueMemo } from './util';
import trackCats from './util/trackCats';

const Engine = ({ options, children }: Props) => {
  const [engine, setEngine] = useState<Matter.Engine>();

  useEffect(() => {
    const engine = Matter.Engine.create(options);
    setEngine(engine);
    const clearCats = trackCats(engine);

    return () => {
      Matter.Engine.clear(engine);
      engine.enabled = false;
      clearCats();
    };
  }, [options]);

  return engine ? <Provider value={engine}>{children}</Provider> : null;
};

export default valueMemo(Engine);

type Props = {
  options: Matter.IEngineDefinition;
  children: React.ReactNode;
};

export const EngineContext = createContext<Matter.Engine>(null as any);
const { Provider } = EngineContext;
export const useEngine = () => useContext(EngineContext);

export const cloneKey = Symbol('clone');
