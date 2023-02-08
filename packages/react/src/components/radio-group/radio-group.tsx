/* eslint-disable react/jsx-props-no-spreading, import/exports-last */
import {
  RADIO_GROUP_ACTIONS as ACTIONS,
  createContainerPropsSelector,
  createRadioGroupStore,
  RADIO_GROUP_CONTAINER_PROPS_MAPPER as PROPS_MAPPERS,
} from '@devextreme/components';
import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  memo,
  PropsWithChildren,
  Ref,
  useMemo,
  useRef,
} from 'react';
import {
  useCallbackRef,
  useCustomComponentRef,
  useSecondEffect,
  useStoreSelector,
} from '../../internal/hooks';
import {
  CssForwardProps,
  EditorProps,
  FocusableProps,
  WithCustomRef,
} from '../../internal/props';
import { withEditor } from '../common';
import { RadioGroupStoreContext } from '../radio-common';

import '@devextreme/styles/src/radio-group/radio-group.scss';

export type RadioGroupRef = {
  focus(options?: FocusOptions): void,
};

function RadioGroupInternal<T>({ componentRef, ...props }: RadioGroupProps<T>): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);

  // NOTE: Workaround for the useImperativeHandler hook.
  useCustomComponentRef(
    componentRef,
    () => ({
      focus(options?: FocusOptions) {
        containerRef.current?.focus(options);
      },
    }),
    [containerRef.current],
  );

  const isValueControlled = useMemo(() => Object.hasOwnProperty.call(props, 'value'), []);
  const valueChange = useCallbackRef(props.valueChange);

  const store = useMemo(() => createRadioGroupStore<T>({
    readonly: PROPS_MAPPERS.getDomOptions(props),
    value: isValueControlled ? props.value : props.defaultValue,
  }, {
    value: {
      controlledMode: isValueControlled,
      changeCallback: (value: T) => { valueChange.current(value); },
    },
  }), []);

  const containerProps = useStoreSelector(store, createContainerPropsSelector, []);

  useSecondEffect(() => {
    if (isValueControlled) {
      store.addUpdate(ACTIONS.updateValue(props.value));
    }
  }, [props.value]);

  const readonlyValues = PROPS_MAPPERS.getDomOptions(props);
  useSecondEffect(() => {
    store.addUpdate(ACTIONS.updateReadonly(readonlyValues));
  }, [...Object.values(readonlyValues)]);

  useSecondEffect(() => {
    store.commitPropsUpdates();
  });

  return (
    <RadioGroupStoreContext.Provider value={store}>
      <div
        ref={containerRef}
        className={`dxr-radio-group ${containerProps.cssClass.join(' ')} ${props.className ?? ''}`}
        style={props.style ?? {}}
        {...containerProps.attributes}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
      >
        {props.name
          ? Children.map(
            props.children,
            child => (
              isValidElement<EditorProps<T>>(child)
                ? cloneElement(child, { name: props.name })
                : child
            ),
          )
          : props.children}
      </div>
    </RadioGroupStoreContext.Provider>
  );
}

const RadioGroupEditor = withEditor(forwardRef(RadioGroupInternal));

export type RadioGroupProps<T> = PropsWithChildren<
EditorProps<T>
& FocusableProps
& CssForwardProps
& WithCustomRef<RadioGroupRef>
>;
type RadioGroupType = <T>(p: RadioGroupProps<T> & { ref?: Ref<HTMLDivElement> }) => JSX.Element;
//* Component={"name":"RadioGroup"}
export const RadioGroup = memo(RadioGroupEditor) as RadioGroupType;
