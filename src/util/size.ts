import { Engine } from 'matter-js';
import { useEngine } from '../Engine';

export const relX = (size: number) => (engine: Engine) =>
  engine.render.options.width! * size;

export const relY = (size: number) => (engine: Engine) =>
  engine.render.options.height! * size;

export type SizeFn = (x: Engine) => number;
export type Size = number | SizeFn;
export type Sizes = {
  [name: string]: Size;
};

export const getSize = (size: Size, engine: Engine): number =>
  typeof size === 'function' ? size(engine) : size;

export const mapEntries = <A, B>(
  object: { [key: string]: A },
  fn: (entry: [string, A]) => [string, B],
) => Object.fromEntries(Object.entries(object).map(fn));

export const mapSizes = (sizes: Sizes) =>
  mapEntries(sizes, ([key, value]) => [key, getSize(value, useEngine())]);
