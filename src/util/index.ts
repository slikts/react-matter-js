import { useState, useCallback } from 'react';
import * as windowSize from '@react-hook/window-size';

export { default as valueMemo, valueCompare } from './valueMemo';

export { default as SpriteMap } from './SpriteMap';

export const randomSuffix = Math.round(Math.random() * 1e10).toString(32);

export const cESVG = (name: string) =>
  document.createElementNS('http://www.w3.org/2000/svg', name);

export const useRerender = () => {
  const [, updateState] = useState();
  return useCallback(() => updateState(Symbol()), []);
};

export const useWindowSize = () => {
  const [width, height] = windowSize.useWindowSize();
  return { width, height };
};

export * from './size';
