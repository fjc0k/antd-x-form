import React from 'react';
import { XRadioButtonGroupProps } from './types';
import { Radio } from 'antd';
import { omit } from '../../utils';

export function XRadioButtonGroup<TValue>(
  props: XRadioButtonGroupProps<TValue>,
) {
  const radioGroupProps = omit(props, ['options']);

  return (
    <Radio.Group {...radioGroupProps}>
      {(props.options || []).map(option => (
        <Radio.Button
          value={option.value}
          disabled={option.disabled}
          key={String(option.value)}>
          {option.label}
        </Radio.Button>
      ))}
    </Radio.Group>
  );
}
