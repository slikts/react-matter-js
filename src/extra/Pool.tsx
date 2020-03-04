import React, { createRef } from 'react';
// import Matter from 'matter-js';
import { relX, relY } from '../util';
import Body from '../bodies/Body';

const Pool = ({ children, count, cats = [] }: Props) => {
  // const engine = useEngine();
  // const { render } = engine;
  // const { context } = render;

  // TODO: find empty positions
  return Array.from({ length: count }, (_, i) => {
    const Component = children[i % children.length];
    const ref = createRef();
    return (
      <Component
        x={relX(Math.random())}
        y={relY(Math.random())}
        key={i}
        bodyRef={ref}
        cats={cats}
      />
    );
  }) as any;
};

export default Pool;

// type Component = (props: any) => React.ReactElement;
type Props = {
  count: number;
  children: any[];
  cats?: any[];
  retries?: number;
} & React.ComponentProps<typeof Body>;
// type BodyRef = MutableRefObject<Body | undefined>;
// const findPosition = (engine, bounds, retries) => {
//   //
// };
