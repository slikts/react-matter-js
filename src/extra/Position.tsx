import React, { cloneElement } from 'react';
import { Body } from 'matter-js';
import Circle from '../bodies/Circle';
import { valueMemo, useForwardRef } from '../util';
import useAttraction, { AttrOptions } from '../util/useAttraction';

const Position = ({
  children,
  bodyRef,
  attrOptions,
  options,
  ...props
}: Props) => {
  const attracteeRef = useForwardRef<Body>(children.props.bodyRef);
  const attractorRef = useForwardRef(bodyRef);

  useAttraction(attractorRef, attracteeRef, attrOptions);

  return (
    <>
      <Circle
        bodyRef={attractorRef}
        options={{ ...options, isSensor: true }}
        {...props}
      ></Circle>
      {cloneElement(children, {
        bodyRef: attracteeRef,
      })}
    </>
  );
};

type Props = {
  children: React.ReactElement;
  attrOptions: AttrOptions;
} & React.ComponentProps<typeof Circle>;

export default valueMemo(Position);
