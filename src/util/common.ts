import { useState, useCallback } from 'react';
import * as windowSize from '@react-hook/window-size';

export const getRandom = (length: number = 1e10) =>
  Math.round(Math.random() * length).toString(32);
export const randomSuffix = getRandom();
export const getRandomId = () => `${getRandom()}-${randomSuffix}`;

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
