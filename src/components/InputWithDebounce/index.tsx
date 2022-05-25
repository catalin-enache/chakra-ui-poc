import React from 'react';
import {
  Input, InputProps
} from '@chakra-ui/react';


type anyCallback = (...args: any[]) => any;
const debounce = (callback: anyCallback, ms: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => { callback(...args); }, ms);
  };
};

export interface InputWithDebounceProps extends InputProps {
  delay?: number;
}

export const InputWithDebounce = React.forwardRef<HTMLInputElement, InputWithDebounceProps>((props: InputWithDebounceProps, ref) => {
  const { delay = 0, onChange = () => {}, ...rest } = props;
  const debouncedOnChange = debounce(onChange, delay);
  return <Input {...rest} onChange={debouncedOnChange} ref={ref} />;
});
