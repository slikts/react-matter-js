import React from 'react';
import Matter from 'matter-js';
import { css } from 'emotion';
import Render from './Render';
import { valueMemo } from './util';
import useClones from './util/useClones';

type Props = {
  children: React.ReactNode;
  options: Matter.IRendererOptions;
  margin?: number;
} & React.ComponentProps<typeof Render>;

const RenderClones = ({ children, options, margin = 40, ...props }: Props) => {
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

const cloneContainerStyle = css`
  position: absolute;
  width: 100%;
  height: 100%;
  fill: #f60;
`;
