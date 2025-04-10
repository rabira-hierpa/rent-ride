import { Dispatch, useCallback, useRef, useState } from 'react';
import useDebouncedCallback, { ControlFunctions } from './useDebouncedCallback';

function valueEquality<T>(left: T, right: T): boolean {
  return left === right;
}

function adjustFunctionValueOfSetState<T>(value: T): T | (() => T) {
  return typeof value === 'function' ? () => value : value;
}

function useStateIgnoreCallback<T>(initialState: T): [T, Dispatch<T>] {
  const [state, setState] = useState(
    adjustFunctionValueOfSetState(initialState)
  );
  const setStateIgnoreCallback = useCallback(
    (value: T) => setState(adjustFunctionValueOfSetState(value)),
    []
  );
  return [state, setStateIgnoreCallback];
}

type SetterFunction<T> = (value: T) => void;

interface DispatchFunction<T> extends ControlFunctions, SetterFunction<T> {}

export default function useDebounce<T>(
  value: T,
  delay: number,
  options?: {
    maxWait?: number;
    leading?: boolean;
    trailing?: boolean;
    equalityFn?: (left: T, right: T) => boolean;
  }
): [T, DispatchFunction<T>] {
  const eq = (options && options.equalityFn) || valueEquality;

  const [state, dispatch] = useStateIgnoreCallback(value);
  const debounced = useDebouncedCallback(
    useCallback((_value: T) => dispatch(_value), [dispatch]),
    delay,
    options
  );
  const previousValue = useRef(value);

  if (!eq(previousValue.current, value)) {
    debounced(value);
    previousValue.current = value;
  }

  return [state, debounced];
}
