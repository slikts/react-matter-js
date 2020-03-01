import React, { ReactNode, createContext, useContext } from 'react';
import { cESVG, randomSuffix } from './common';

class SpriteMap extends Map<string, SVGPathElement> {
  constructor(
    sprites: Sprites = [],
    private container: any,
    private options: Options,
  ) {
    super(sprites);
  }

  set(key: string, shape: SVGPathElement) {
    const id = `${key}-${randomSuffix}`;
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

    return super.set(key, shape);
  }

  delete(key: string) {
    const id = this.get(key);
    document.querySelector(`#${id}`)?.remove();

    return super.delete(key);
  }
}

export default SpriteMap;

type Options = {
  margin?: number;
};
type Sprites = [string, SVGPathElement][];

export const createSpriteMap = (sprites: Sprites, { margin }: Options) => {
  const container = cESVG('svg');
  container.style.visibility = 'hidden';
  container.style.position = 'absolute';
  document.body.appendChild(container);

  const spriteMap = new SpriteMap(sprites, container, { margin });
  const SpriteProvider = ({ children }: { children: ReactNode }) => (
    <Provider value={spriteMap}>{children}</Provider>
  );

  return { spriteMap, SpriteProvider };
};

export const SpriteContext = createContext<SpriteMap>(null as any);
const { Provider } = SpriteContext;
export const useSprites = () => useContext(SpriteContext);
export const useSprite = (key: string) =>
  useSprites()
    .get(key)
    ?.getAttribute('id');
