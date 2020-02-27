/** @jsx createElement */

import { Fragment } from 'react';
import { createElement } from '../util';

import Rectangle from '../bodies/Rectangle';

type Props = {
  x: number;
  y: number;
  width: number;
  height: number;
  wallWidth?: number;
  options: React.ComponentProps<typeof Rectangle>['options'];
};

const Walls = ({ x, y, width, height, wallWidth = 100, options }: Props) => {
  const props = {
    options: {
      ...options,
      isStatic: true,
    },
  };

  const top = {
    ...props,
    x: x + width / 2,
    y: y + wallWidth / 2,
    width: width,
    height: wallWidth,
  };
  const bottom = {
    ...props,
    ...top,
    y: height - wallWidth / 2,
  };
  const left = {
    ...props,
    x: x + wallWidth / 2,
    y: y + height / 2,
    height: height + wallWidth * 2,
    width: wallWidth,
  };
  const right = {
    ...props,
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
