import Matter from 'matter-js';

declare module 'matter-js' {
  interface Body {
    // TODO: type
    clone: any;
  }
}
