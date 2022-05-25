import React, {useCallback, useRef, useEffect, useState} from 'react';
import { InputWithDebounce, InputWithDebounceProps } from "../InputWithDebounce";
import { SelectableList, SpecificSelectableListProps } from "../SelectableList";
import { VStack } from "@chakra-ui/react";
import { nativeInputValueSetter } from "../../utils";

interface InputSearchTermsProps extends InputWithDebounceProps {
  options: SpecificSelectableListProps['options'];
  onSearch: (evt: React.ChangeEvent<HTMLInputElement>) => void;
}

// This is how a complex component should look like (to some extent) in order to be integrated with react-hook-form using "register".
// I admit it is unnatural for a React component to be designed like this.
// When using "register" react-hook-form assumes that the component is a native input or the ref to it forwards to a native input.
// react-hook-form will put a "ref" on the component and is only interested in onChange/onBlur.
// It is NOT interested in passing down the value.
// react-hook-form sets the input value natively (like: domNode.value = value)
// For this component we have a hidden input which receive the "ref" from react-hook-form, so it thinks it is talking with that one.
// By simulating a native component we are able to use react-hook-form's "register".
// Else we have to use react-hook-form's Controller.
export const InputSearchTerms = React.forwardRef<HTMLInputElement, InputSearchTermsProps>((props: InputSearchTermsProps, ref) => {
  const { options, onSearch, onChange, id, name, ...rest } = props;
  const inputPrivate = useRef<HTMLInputElement | null>(null);
  const inputWithDebounce = useRef<HTMLInputElement | null>(null);
  const [isListVisible, setIsListVisible] = useState(false);

  // transfer the value from hidden input to visible input
  useEffect(() => {
    inputPrivate.current && nativeInputValueSetter?.call(inputWithDebounce.current, inputPrivate.current.value);
  }, []);

  useEffect(() => {
     setIsListVisible(!!Object.keys(options).length);
  }, [options]);

  const handleInputClick = useCallback(() => {
    setIsListVisible(!!Object.keys(options).length);
  }, [options]);

  const handleChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    nativeInputValueSetter?.call(inputPrivate.current, evt.target.value);
    nativeInputValueSetter?.call(inputWithDebounce.current, evt.target.value);
    const  inputEvent = new Event('input', { bubbles: true});
    inputPrivate.current?.dispatchEvent(inputEvent);
    setIsListVisible(false);
  }, []);

  const handleSearch = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(evt);
    onSearch(evt);
  }, [handleChange, onSearch]);

  // Sharing the inputPrivate ref internally and externally
  const setRef = useCallback((el: HTMLInputElement) => {
    inputPrivate.current = el;
    (ref && typeof ref === 'function') ? ref(el) : (ref!.current = el);
  }, [ref]);

  return (
    <VStack position="relative" width="100%" spacing="2">
      {/* Observe: we never call onChange manually, we set the value on inputHidden, then we dispatch a native input event */}
      {/* we're simulating a native input */}
      <input id={id} name={name} onChange={onChange} ref={setRef} style={{ display: 'none' }} />
      <InputWithDebounce width="100%" onClick={handleInputClick} onChange={handleSearch} ref={inputWithDebounce} {...rest}  />
      {/* onChange sets the value on inputPrivate and also reads the value from it */}
      {isListVisible && <SelectableList options={options} value={inputPrivate.current?.value ?? ''} onChange={handleChange} />}
    </VStack>
  );
});
