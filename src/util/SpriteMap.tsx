import { cESVG, randomSuffix } from '.';

class SpriteMap extends Map<string, any> {
  constructor(private margin = 0) {
    super();
  }

  set(key: string, shape: SVGPathElement) {
    const id = `${key}-${randomSuffix}`;
    const symbol = cESVG('symbol');
    symbol.setAttribute('id', id);
    symbol.appendChild(shape);
    container.appendChild(symbol);
    const bBox = shape.getBBox();
    const { margin } = this;
    const viewBox = `
      ${bBox.x - margin}
      ${bBox.y - margin}
      ${bBox.width + margin * 2}
      ${bBox.height + margin * 2}
    `;
    symbol.setAttribute('viewBox', viewBox);

    return super.set(key, id);
  }

  delete(key: string) {
    const id = this.get(key);
    document.querySelector(`#${id}`)?.remove();

    return super.delete(key);
  }
}

export default SpriteMap;

const container = cESVG('svg');
container.style.visibility = 'hidden';
container.style.position = 'absolute';
document.appendChild(container);
