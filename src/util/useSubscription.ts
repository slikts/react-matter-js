import { useMemo, useCallback } from 'react';
import DefaultMap from './DefaultMap';

const useSubscription = () => {
  const subs = useMemo(
    () => new DefaultMap<any, any>(() => new Set<any>()),
    [],
  );
  const emit = useCallback(() => {}, [subs]);
  return emit;
};
export default useSubscription;
