import { XSelectProps } from './types';
import { Select } from 'antd';
import React, { useMemo } from 'react';
import { omit } from '../../utils';
import { SelectValue } from 'antd/lib/select';

export function XSelect<TValue extends SelectValue>(
  props: XSelectProps<TValue>,
) {
  const selectProps = omit(props, ['options']);

  const children = useMemo(() => {
    return props.options.map(function render(item) {
      return Array.isArray((item as any).children) ? (
        <Select.OptGroup label={item.label} key={(item as any).key}>
          {render((item as any).children)}
        </Select.OptGroup>
      ) : (
        <Select.Option
          value={(item as any).value}
          label={(item as any).option ? item.label : undefined}
          optionLabelProp={(item as any).option ? 'label' : 'children'}>
          {(item as any).option || item.label}
        </Select.Option>
      );
    });
  }, [props.options]);

  return <Select {...selectProps}>{children}</Select>;
}
