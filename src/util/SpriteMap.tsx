import { createContext, useContext } from 'react';
import { cESVG, getRandomId } from './common';

class SpriteMap extends Map<SpriteKey, string> {
  constructor(
    sprites: Sprites = [],
    private container: any,
    private options: SpriteOptions = {},
  ) {
    super(sprites);
  }

  set(shape: SpriteKey, id: string = getRandomId()) {
    if (this.has(shape)) {
      return this;
    }
    const symbol = cESVG('symbol');
    symbol.setAttribute('id', id);
    symbol.appendChild(shape);
    const { container } = this;
    container.appendChild(symbol);
    const bBox = shape.getBBox();
    const { margin = 0 } = this.options;
    const viewBox = `
      ${bBox.x - margin}
      ${bBox.y - margin}
      ${bBox.width + margin * 2}
      ${bBox.height + margin * 2}
    `;
    symbol.setAttribute('viewBox', viewBox);

    return super.set(shape, id);
  }

  delete(shape: SVGPathElement) {
    const id = this.get(shape);
    document.querySelector(`#${id}`)?.remove();

    return super.delete(shape);
  }
}

export default SpriteMap;

export type SpriteOptions = {
  margin?: number;
};
export type Sprites = [SpriteKey, string][];
export type SpriteKey = SVGPathElement | SVGGElement;

const container = cESVG('svg');
container.style.visibility = 'hidden';
container.style.position = 'absolute';
document.body.appendChild(container);

const spriteMap = new SpriteMap([], container);

export const loadSprites = (sprites: Sprites) => {
  sprites.forEach(([key, path]) => void spriteMap.set(key, path));
};

export const SpriteContext = createContext<SpriteMap>(spriteMap);

export const useSprites = () => useContext(SpriteContext);
export const useSprite = (shape: SpriteKey) =>
  useSprites()
    .set(shape)
    .get(shape);
