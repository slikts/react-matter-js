import { createValueElement } from 'react-default-memo';
import { useState, useCallback, useRef } from 'react';

export { default as valueMemo } from './valueMemo';
export const randomSuffix = Math.round(Math.random() * 1e10).toString(32);

export const createElement = (type: any, props: any, ...children: any[]) => {
  return createValueElement(type, props, ...children);
};

// export const useValueMemo = (callback, deps) =>
//   useMemo(
//     callback,
//     deps.map(dep => (isPrimitive(dep) ? dep : JSON.stringify(dep))),
//   );

export const cESVG = (name: string) =>
  document.createElementNS('http://www.w3.org/2000/svg', name);

const useRerender = () => {
  const [, updateState] = useState();
  return useCallback(() => updateState(Symbol()), []);
};

export const useUpdate = <A>(init: A) => {
  const rerender = useRerender();
  const [state, setState] = useState(init);
  const updateState = useCallback((state: A) => {
    setState(state);
    rerender();
  }, []);
  return [state, updateState] as const;
};
