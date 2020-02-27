import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  createRef,
} from 'react';
import ReactDOM from 'react-dom';
import { css } from 'emotion';
import { cESVG, randomSuffix } from './util';

export const SpriteContext = createContext<Map<string, any> | null>(null);
const { Provider } = SpriteContext;

export const useSprites = () => useContext(SpriteContext);

console.log(123);

const ref = createRef<SVGSVGElement>();
ReactDOM.render(
  <svg
    ref={ref}
    className={css`
      visibility: hidden;
      position: absolute;
    `}
  />,
  document.body,
);

// spriteMap.style.visibility = 'hidden';
// spriteMap.style.position = 'absolute';
// document.body.appendChild(spriteMap);
//
type Props = {
  docs: SVGElement[];
  margin?: number;
  children: React.ReactNode;
};

const SpriteMap = ({ docs, margin = 40, children }: Props) => {
  const [map, setMap] = useState<Map<string, any>>();
  /*
  useEffect(() => {
    if (!docs || map) {
      return;
    }

    const entries: [string, any][] = docs
      .map(doc =>
        Array.from(
          doc.querySelectorAll('[id]') as any,
          (shape: SVGPathElement) => {
            const id = shape.getAttribute('id');
            shape.removeAttribute('id');
            spriteMap.appendChild(shape);
            const randomID = `sprite__${id}__${randomSuffix}`;

            spriteMap.appendChild(shape);

            var BBox = shape.getBBox();

            const symbol = cESVG('symbol');
            symbol.setAttribute('id', randomID);
            symbol.appendChild(shape);
            const viewBox = `
            ${BBox.x - margin}
            ${BBox.y - margin}
            ${BBox.width + margin * 2}
            ${BBox.height + margin * 2}
          `;
            symbol.setAttribute('viewBox', viewBox);
            spriteMap.appendChild(symbol);

            return [id, { id: randomID, shape, symbol }] as any;
          },
        ),
      )
      .flat();
    setMap(new Map(entries));

    return () => {
      if (map) {
        for (const [id, { symbol }] of map.entries()) {
          spriteMap.removeChild(symbol);
          map.remove(id);
        }
      }
    };
  }, [docs, map, margin]);
  return <Provider value={map}>{children}</Provider>;
  */
};

export default SpriteMap;
