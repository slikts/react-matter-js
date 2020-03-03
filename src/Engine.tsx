import React, { useState } from 'react';
import Matter from 'matter-js';
import { shallow } from 'tuplerone';

import { valueMemo, EngineContext, useValueEffect } from './util';
import trackCats from './util/trackCats';
import trackEvents from './util/trackEvents';

const Engine = ({ options, events = true, children }: Props) => {
  const [engine, setEngine] = useState<Matter.Engine | null>(null);

  useValueEffect(() => {
    const engine = shallow(Matter.Engine.create(options));
    setEngine(engine);
    const clearCats = trackCats(engine);
    const clearEvents = events ? trackEvents(engine) : null;

    return () => {
      Matter.World.clear(engine.world, false);
      Matter.Engine.clear(engine);
      engine.enabled = false;
      clearCats();
      if (clearEvents) {
        clearEvents();
      }
      setEngine(null);
    };
  }, [options, events]);

  return engine ? <Provider value={engine}>{children}</Provider> : null;
};

export default valueMemo(Engine);

type Props = {
  events?: boolean;
  options: Matter.IEngineDefinition;
  children: React.ReactNode;
};

export const cloneKey = Symbol('clone');

const { Provider } = EngineContext;
