import React, { useState, createContext, useContext, useEffect } from 'react';
import Matter from 'matter-js';

import { valueMemo } from './util';

const Engine = ({ options, children }: Props) => {
  const [engine, setEngine] = useState<Matter.Engine | null>();

  useEffect(() => {
    const engine = Matter.Engine.create(options);
    setEngine(engine);

    return () => {
      Matter.Engine.clear(engine);
      engine.enabled = false;
      setEngine(null);
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
