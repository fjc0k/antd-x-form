import { SelectProps } from 'antd/lib/select';
import { Merge } from '../../types';

export interface XSelectItem<TValue> {
  label: React.ReactNode;
  value: TValue;
  option?: React.ReactNode;
  disabled?: boolean;
}

export interface XSelectGroup<TValue> {
  label: React.ReactNode;
  key: string | number;
  children: Array<XSelectItem<TValue>>;
}

export type XSelectOptions<TValue> = Array<
  XSelectItem<TValue> | XSelectGroup<TValue>
>;

export type XSelectProps<TValue> = Merge<
  SelectProps<TValue>,
  {
    options: XSelectOptions<TValue>;
  }
>;
