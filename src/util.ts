import {
  PropsWithChildren,
  memo,
  ComponentType,
  MemoExoticComponent,
} from 'react';
import { ValueObject } from 'tuplerone';
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

const keyFilter = ([key]: [string, any]) => !key.startsWith('_');
export const valueCompare = <P>(
  prev: Readonly<PropsWithChildren<P>>,
  next: Readonly<PropsWithChildren<P>>,
): boolean => {
  console.log(prev, next);

  return ValueObject(prev, keyFilter) === ValueObject(next, keyFilter);
};
export const valueMemo = <A>(
  component: ComponentType<A>,
): MemoExoticComponent<ComponentType<A>> => memo(component, valueCompare);
