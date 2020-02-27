export { default as valueMemo } from './valueMemo';

import { createValueElement } from 'react-default-memo';

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
