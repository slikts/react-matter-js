import { useEffect } from 'react';
import { ValueObject } from 'tuplerone';

const useValueEffect = (
  effect: React.EffectCallback,
  deps?: React.DependencyList,
) => {
  useEffect(effect, ValueObject(deps));
};

export default useValueEffect;
