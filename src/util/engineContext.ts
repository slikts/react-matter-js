import { createContext, useContext } from 'react';

export const EngineContext = createContext<Matter.Engine>(null as any);
export const useEngine = () => useContext(EngineContext);
