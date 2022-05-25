import React, { useCallback, useEffect, useRef, useState } from 'react';
import { InputWithDebounce, InputWithDebounceProps } from "../InputWithDebounce";
import { SelectableList, SpecificSelectableListProps } from "../SelectableList";
import { VStack } from "@chakra-ui/react";

interface InputSearchTermsPropsBis extends Omit<InputWithDebounceProps, 'onChange'> {
  options: SpecificSelectableListProps['options'];
  onChange: (selected: string) => void;
  onSearch: (term: string) => void;
}

// This is a re-make of InputSearchTerms as a controlled component.
// Being controlled it needs to be used with react-hook-form's Controller
// Note: unlike InputSearchTerms where onSearch/onChange are called with input event,
// here we can call them directly with the value of interest (string)
export const InputSearchTermsBis = React.forwardRef<HTMLInputElement, InputSearchTermsPropsBis>((props: InputSearchTermsPropsBis, ref) => {
  const { options, onSearch, value, onChange, id, name, ...rest } = props;
  const [isListVisible, setIsListVisible] = useState(false);

  const inputWithDebounce = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputWithDebounce.current && (inputWithDebounce.current.value = value as string);
  }, [value]);

  useEffect(() => {
     setIsListVisible(!!Object.keys(options).length);
  }, [options]);

  const handleInputClick = useCallback(() => {
    setIsListVisible(!!Object.keys(options).length);
  }, [options]);

  const handleChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    onChange && onChange(evt.target.value);
    setIsListVisible(false);
    inputWithDebounce.current && (inputWithDebounce.current.value = evt.target.value);
  }, [onChange]);

  const handleSearch = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(evt.target.value);
  }, [onSearch]);

  return (
    <VStack position="relative" width="100%" spacing="2">
      <InputWithDebounce width="100%" onClick={handleInputClick} onChange={handleSearch} {...rest} ref={inputWithDebounce}  />
      {isListVisible && <SelectableList options={options} value={value as string | undefined} onChange={handleChange} />}
    </VStack>
  );
});
