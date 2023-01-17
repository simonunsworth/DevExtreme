import {
  ForwardedRef,
  forwardRef,
  useContext,
} from 'react';
import { useId } from '../../internal/hooks';
import { RadioGroupStoreContext } from '../radio-common';
import { CoreBoundRadioButton, UncontrolledRadioButton } from './radio-button-hocs';
import { RadioButtonInternal } from './radio-button-internal';
import {
  RadioButtonProps,
} from './types';

function RadioButtonWithForwardedRef<T>(
  props: RadioButtonProps<T>,
  inputRef: ForwardedRef<HTMLInputElement>,
) {
  const store = useContext(RadioGroupStoreContext);
  const inputId = useId('radio-button');

  const RadioButtonComponent = props.checked === undefined
    ? UncontrolledRadioButton
    : RadioButtonInternal;
  if (store) {
    return (
      <CoreBoundRadioButton
        store={store}
        inputId={inputId}
        inputRef={inputRef}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
      />
    );
  }
  return (
    <RadioButtonComponent
      inputId={inputId}
      inputRef={inputRef}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    />
  );
}

//* Component={"name":"RadioButton", "jQueryRegistered":true, "hasApiMethod":true}
const RadioButton = forwardRef(RadioButtonWithForwardedRef) as <T> (
  props: RadioButtonProps<T>,
  inputRef: ForwardedRef<HTMLInputElement>
) => ReturnType<typeof RadioButtonWithForwardedRef>;

export { RadioButton };
