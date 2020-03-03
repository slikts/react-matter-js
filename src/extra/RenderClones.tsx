import React from 'react';
import Matter from 'matter-js';
import { css } from 'emotion';
import Render from '../Render';
import { valueMemo } from '../util';
import useClones from '../util/useClones';

const RenderClones = ({
  children,
  options = {},
  // TODO: ?
  margin = 40,
  ...props
}: Props) => {
  const { width, height } = options;
  const { dom, svg } = useClones();

  return (
    <Render {...props} options={options}>
      <div className={cloneContainerStyle}>{dom}</div>
      <svg viewBox={`0 0 ${width} ${height}`} className={cloneContainerStyle}>
        {svg}
      </svg>
      {children}
    </Render>
  );
};

export default valueMemo(RenderClones);

type Props = {
  children?: React.ReactNode;
  options?: Matter.IRendererOptions;
  margin?: number;
} & React.ComponentProps<typeof Render>;

const cloneContainerStyle = css`
  > div {
    position: absolute;
    top: 0;
    left: 0;
  }
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;
