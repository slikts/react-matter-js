declare module '*.scss' {
  const content: { [className: string]: string };
  export default content;
}

declare module 'react-default-memo' {
  export const createValueElement: any;
}
