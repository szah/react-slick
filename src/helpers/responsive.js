/* flow */
import compose from 'lodash/partialRight';

export const getCurrentBreakpoint = (currentSize: number) =>
  (breakpoints: ?Array<number>): ?number => {
    if (Array.isArray(breakpoints)) {
      return breakpoints.reduce((acc, val) => {
        if (val >= currentSize && val < acc) {
          return val;
        }
        return acc;
      }, Infinity);
    }

    return null;
  };

export const pluck = (field: string) => (collection: ?Array<Object>) : any => {
  if (Array.isArray(collection)) {
    return collection.map(item => item[field]);
  }

  return null;
};

export const getBreakpoints = pluck('breakpoints');

export const currentBreakpoint = (currentSize: number) : ?number =>
  compose(getCurrentBreakpoint(currentSize), getBreakpoints);
