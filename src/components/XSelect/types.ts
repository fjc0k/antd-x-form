import { Merge, RequireExactlyOne, StrictOmit } from '../../types'
import { SelectProps } from 'antd/lib/select'

/** 项目 */
export interface XSelectItem<TValue> {
  /** 标签 */
  label: React.ReactNode,
  /** 值 */
  value: TValue,
  /** 选项 */
  option?: React.ReactNode,
  /** 是否禁止选择 */
  disabled?: boolean,
}

/** 分组 */
export type XSelectGroup<TValue> =
  | {
    /** 分组标签 */
    label: string | number,
    /** 分组唯一标识 */
    key?: string | number,
    /** 分组选项列表 */
    children: Array<XSelectItem<TValue>>,
  }
  | {
    /** 分组标签 */
    label: React.ReactNode,
    /** 分组唯一标识 */
    key: string | number,
    /** 分组选项列表 */
    children: Array<XSelectItem<TValue>>,
  }

/** 数据 */
export type XSelectData<TValue> = Array<XSelectItem<TValue> | XSelectGroup<TValue>>

export interface XSelectService<TValue> {
  (payload: {
    /** 搜索关键词 */
    keyword: string,
    /** 是否是初始搜索 */
    initial: boolean,
  }): Promise<XSelectData<TValue>>,
}

// data、service 必填一个
// mode: 类型不友好，新增组件代替
// labelInValue: 类型不友好，去除
// optionLabelProp: 用 options[].option 代替
export type XSelectProps<TValue> = RequireExactlyOne<Merge<StrictOmit<SelectProps<TValue>, 'mode' | 'labelInValue' | 'optionLabelProp'>, {
  /** 选项数据 */
  data?: XSelectData<TValue>,
  /** 获取选项数据的服务 */
  service?: XSelectService<TValue>,
  /** 初始选中值 */
  defaultValue?: TValue,
  /** 当前选中值 */
  value?: TValue,
  /** 选中值变化时回调函数 */
  onChange?: (value: TValue) => any,
}>, 'data' | 'service'>

export type XSelectMultipleProps<TValue> = Merge<XSelectProps<TValue>, {
  /** 初始选中值 */
  defaultValue?: TValue[],
  /** 当前选中值 */
  value?: TValue[],
  /** 选中值变化时回调函数 */
  onChange?: (value: TValue[]) => any,
}>

export type XSelectTagsProps<TValue> = Merge<XSelectProps<TValue>, {
  /** 初始选中值 */
  defaultValue?: TValue[],
  /** 当前选中值 */
  value?: TValue[],
  /** 选中值变化时回调函数 */
  onChange?: (value: TValue[]) => any,
}>
