import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  Engine,
  RenderClones,
  Walls,
  Rectangle,
  Circle,
  Constraint,
} from '../src/.';
import * as style from './style';
import * as emotion from 'emotion';
import { Global, css } from '@emotion/core';

const App = () => {
  const width = 600;
  const height = 400;
  return (
    <div className={style.body}>
      <Global
        styles={css`
          body {
            background: #111;
          }
        `}
      />
      <Engine options={{}}>
        <RenderClones
          enableMouse
          options={{
            width,
            height,
            background: 'transparent',
            wireframeBackground: 'transparent',
          }}
        >
          <Walls x={0} y={0} width={width} height={height} wallWidth={25} />
          <Circle
            clone
            x={500}
            y={100}
            radius={50}
            className={css``}
            cloneClass={css`
              fill: #f06;
            `}
          />
          <Constraint>
            <Circle clone x={100} y={100} radius={50} />
            <Rectangle clone x={300} y={100} width={100} height={100} />
          </Constraint>
        </RenderClones>
      </Engine>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
