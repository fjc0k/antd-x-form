import { Merge, RequireExactlyOne, StrictOmit } from '../../types'
import { SelectProps } from 'antd/lib/select'

export interface XSelectItem<TValue> {
  label: React.ReactNode,
  value: TValue,
  option?: React.ReactNode,
  disabled?: boolean,
}

export type XSelectGroup<TValue> =
  | {
    label: string | number,
    key?: string | number,
    children: Array<XSelectItem<TValue>>,
  }
  | {
    label: React.ReactNode,
    key: string | number,
    children: Array<XSelectItem<TValue>>,
  }

export type XSelectOptions<TValue> = Array<XSelectItem<TValue> | XSelectGroup<TValue>>

export interface XSelectService<TValue> {
  (payload: {
    /** 搜索关键词 */
    keyword: string,
    /** 是否是初始搜索 */
    initial: boolean,
  }): Promise<XSelectOptions<TValue>>,
}

// options、service 必填一个
// mode: 类型不友好，新增组件代替
// labelInValue: 类型不友好，去除
// optionLabelProp: 用 options[].option 代替
export type XSelectProps<TValue> = RequireExactlyOne<Merge<StrictOmit<SelectProps<TValue>, 'mode' | 'labelInValue' | 'optionLabelProp'>, {
  options?: XSelectOptions<TValue>,
  service?: XSelectService<TValue>,
  defaultValue?: TValue,
  value?: TValue,
  onChange?: (value: TValue) => any,
}>, 'options' | 'service'>

export type XSelectMultipleProps<TValue> = Merge<XSelectProps<TValue>, {
  defaultValue?: TValue[],
  value?: TValue[],
  onChange?: (value: TValue[]) => any,
}>

export type XSelectTagsProps<TValue> = Merge<XSelectProps<TValue>, {
  defaultValue?: TValue[],
  value?: TValue[],
  onChange?: (value: TValue[]) => any,
}>
