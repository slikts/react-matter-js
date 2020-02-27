import {
  PropsWithChildren,
  memo,
  ComponentType,
  MemoExoticComponent,
} from 'react';
import { ValueObject } from 'tuplerone';

const valueMemo = <A>(
  component: ComponentType<A>,
): MemoExoticComponent<ComponentType<A>> => memo(component, valueCompare);

export default valueMemo;

const keyFilter = ([key]: [string, any]) => !key.startsWith('_');
export const valueCompare = <P>(
  prev: Readonly<PropsWithChildren<P>>,
  next: Readonly<PropsWithChildren<P>>,
): boolean => ValueObject(prev, keyFilter) === ValueObject(next, keyFilter);
