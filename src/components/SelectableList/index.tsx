import React, { useCallback, useRef } from 'react';
import { chakra, UnorderedList, ListProps, useStyleConfig } from '@chakra-ui/react';
import { nativeInputValueSetter } from "../../utils";

export interface SpecificSelectableListProps {
  options: Record<string, JSX.Element | string>;
  value?: string;
  onChange?: (evt: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface SelectableListProps extends Omit<ListProps, 'onChange'>, SpecificSelectableListProps {}

// The reason for using a hidden input is that
// we need to emit an "input event" that react-hook-form understands when using "register".
export const SelectableList = (props: SelectableListProps) => {
  const { options, value = '', onChange, variant, ...rest } = props;
  const styles: any = useStyleConfig("SelectableList", {});
  const inputEl = useRef<HTMLInputElement | null>(null);

  const handleValueSelect = useCallback((evt: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    // the value is stored in li[data-value]
    const _value = (evt.nativeEvent.target as HTMLElement).closest('li')!.dataset['value'] as string;
    nativeInputValueSetter?.call(inputEl.current, _value);
    const  inputEvent = new Event('input', { bubbles: true});
    inputEl.current?.dispatchEvent(inputEvent);
  }, []);

  return (
    <>
      <input type="text" ref={inputEl} onChange={onChange} style={{ display: 'none' }} />
      <UnorderedList __css={styles.list} width="100%" listStyleType="none" {...rest}>
        {[...Object.entries(options)].map(([key, val]) =>
          <chakra.li
            key={key}
            data-value={key}
            __css={styles.item}
            bgColor={key === value ? 'gray.300' : 'transparent'}
            onClick={handleValueSelect}
          >
            {val}
          </chakra.li>)
        }
      </UnorderedList>
    </>
  );
};
