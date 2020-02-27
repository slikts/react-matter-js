import { useState } from 'react';

export const useRerender = () => {
  const [, rerender] = useState();

  return () => rerender(Symbol());
};
