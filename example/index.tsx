import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Engine, Render, Walls, Rectangle, Circle } from '../src/.';

const App = () => {
  const width = 600;
  const height = 400;
  return (
    <div>
      <Engine options={{}}>
        <Render
          options={{
            width,
            height,
          }}
        >
          <Walls x={0} y={0} width={width} height={height} wallWidth={25} />
          <Circle x={100} y={100} radius={50} />
          <Rectangle x={300} y={100} width={100} height={100} />
        </Render>
      </Engine>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
