import React, { Fragment } from 'react';

import Rectangle from '../bodies/Rectangle';
import { Size, useMapSizes } from '../util';

const Walls = ({ options, ...props }: Props) => {
  const defaultProps = {
    options: {
      ...options,
      isStatic: true,
    },
  };

  const { x, y, width, height, wallWidth } = useMapSizes(pickSizes(props));

  const top = {
    ...defaultProps,
    x: x + width / 2,
    y: y + wallWidth / 2,
    width: width,
    height: wallWidth,
  };
  const bottom = {
    ...defaultProps,
    ...top,
    y: height - wallWidth / 2,
  };
  const left = {
    ...defaultProps,
    x: x + wallWidth / 2,
    y: y + height / 2,
    height: height,
    width: wallWidth,
  };
  const right = {
    ...defaultProps,
    ...left,
    x: width - wallWidth / 2,
  };

  return (
    <Fragment>
      <Rectangle {...top} />
      <Rectangle {...bottom} />
      <Rectangle {...left} />
      <Rectangle {...right} />
    </Fragment>
  );
};

export default Walls;

type Props = {
  x: Size;
  y: Size;
  width: Size;
  height: Size;
  wallWidth?: Size;
  options?: React.ComponentProps<typeof Rectangle>['options'];
};

const pickSizes = ({
  x,
  y,
  width,
  height,
  wallWidth = 100,
}: Pick<Props, 'x' | 'y' | 'width' | 'height' | 'wallWidth'>) => ({
  x,
  y,
  width,
  height,
  wallWidth,
});
