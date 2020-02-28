import { useState, useCallback } from 'react';

export { default as valueMemo } from './valueMemo';
export const randomSuffix = Math.round(Math.random() * 1e10).toString(32);

export const cESVG = (name: string) =>
  document.createElementNS('http://www.w3.org/2000/svg', name);

export const useRerender = () => {
  const [, updateState] = useState();
  return useCallback(() => updateState(Symbol()), []);
};
