import React, { createRef, useEffect } from 'react';
import Matter from 'matter-js';
import { shallow } from 'tuplerone';
import Body from '../bodies/Body';
import Rectangle from '../bodies/Rectangle';
import { cloneKey, domKey } from '../util/useClones';
import {
  valueMemo,
  useValueEffect,
  useForwardRef,
  useRerender,
  useMapSizes,
} from '../util';

const Html = ({
  x,
  y,
  clone = false,
  options,
  bodyRef,
  children,
  cloneProps,
  ...props
}: Props) => {
  const rerender = useRerender();
  const ref = useForwardRef(bodyRef);
  const sizes = useMapSizes({
    x,
    y,
    width: 100,
    height: 100,
  });

  useValueEffect(() => {
    const { x, y, width, height } = sizes;
    const body = shallow(Matter.Bodies.rectangle(x, y, width, height, options));
    ref.current = body;
    if (clone) {
      const ref = createRef<HTMLDivElement>();
      const el = (
        <div {...cloneProps} ref={ref} key={body.id}>
          {children}
        </div>
      );
      body[cloneKey] = {
        key: domKey,
        ref,
        el,
      };
    }
    rerender();
  }, [options]);
  useEffect(() => {
    const body = ref.current!;
    Matter.Body.setPosition(body, { x: sizes.x, y: sizes.y });
  }, [x, y, ref, sizes.x, sizes.y]);

  return ref.current ? (
    <Body {...props} bodyRef={ref} key={ref.current.id} />
  ) : null;
};

export default valueMemo(Html);

type Props = Omit<
  React.ComponentProps<typeof Rectangle>,
  'width' | 'height'
> & {
  children: React.ReactElement;
  cloneProps?: React.HTMLProps<HTMLDivElement>;
};
