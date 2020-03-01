import React from 'react';
import Scene from './Scene';
import { useWindowSize } from '../util';

const WindowScene = (props: Props) => {
  const { width, height } = useWindowSize();

  return <Scene {...props} width={width} height={height} />;
};

export default WindowScene;

type Props = Omit<React.ComponentProps<typeof Scene>, 'width' | 'height'>;
