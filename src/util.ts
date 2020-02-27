// import { useMemo } from "react"
import { createValueElement } from 'react-default-memo';

export const randomSuffix = Math.round(Math.random() * 1e10).toString(32);

export const createElement = (type: any, props: any, ...children: any[]) => {
  // if (type?.name) {
  //   console.log(type?.name);
  // }
  return createValueElement(type, props, ...children);
};

// export const useValueMemo = (callback, deps) =>
//   useMemo(
//     callback,
//     deps.map(dep => (isPrimitive(dep) ? dep : JSON.stringify(dep))),
//   );
