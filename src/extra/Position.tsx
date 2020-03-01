import React, { cloneElement, useRef } from 'react';
import { Body } from 'matter-js';
import { Circle } from '..';
import { valueMemo, useForwardRef, useAttraction } from '../util';

const Position = ({ children, bodyRef, options, ...props }: Props) => {
  const attracteeRef = useForwardRef<Body>(children.props.bodyRef);
  const attractorRef = useForwardRef(bodyRef);

  useAttraction(attractorRef, attracteeRef);

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
} & React.ComponentProps<typeof Circle>;

export default valueMemo(Position);

/*
      Object.values(letters).forEach(({ body }) => {
        const d = 0.001;
        const x = randomSign() * d;
        const y = randomSign() * d;

        Body.applyForce(body, body.position, {
          x,
          y,
        });
        body.torque = randomSign() * 0.1;
      });
      */
