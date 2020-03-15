import React from 'react';
import { Checkbox } from 'antd';
import { hasOwn, omit } from '../../utils';
import { XCheckboxProps } from './types';

export function XCheckbox(props: XCheckboxProps) {
  const checkboxProps = omit(props, ['value', 'defaultValue']);
  if (hasOwn(props, 'value')) {
    checkboxProps.checked = props.value;
  } else if (hasOwn(props, 'defaultValue')) {
    checkboxProps.defaultChecked = props.defaultValue;
  }
  return <Checkbox {...checkboxProps} />;
}

XCheckbox.Group = Checkbox.Group;
