import { useEffect, useMemo } from 'react';
import { ValueObject } from 'tuplerone';

export const useValueEffect = (
  callback: React.EffectCallback,
  deps?: React.DependencyList,
) => void useEffect(callback, ValueObject(deps));

export const useValueMemo = <A>(
  factory: () => A,
  deps?: React.DependencyList,
) => useMemo(factory, ValueObject(deps));
