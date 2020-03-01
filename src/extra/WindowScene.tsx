import React from 'react';
import Scene from './Scene';
import Walls from './Walls';
import { useWindowSize, relX, relY } from '../util';

const WindowScene = ({ walled = false, children, ...props }: Props) => {
  const { width, height } = useWindowSize();
  const wallWidth = 50;
  const wall = walled ? (
    <Walls
      x={-wallWidth}
      y={-wallWidth}
      width={engine => relX(1)(engine) + wallWidth}
      height={engine => relY(1)(engine) + wallWidth}
      wallWidth={wallWidth}
      options={{
        render: {
          visible: false,
        },
      }}
    />
  ) : null;

  return (
    <Scene {...props} width={width} height={height}>
      {wall}
      {children}
    </Scene>
  );
};

export default WindowScene;

type Props = Omit<React.ComponentProps<typeof Scene>, 'width' | 'height'> & {
  walled?: boolean;
};
