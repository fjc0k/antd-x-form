import * as Yup from 'yup'
import {DeepPartial, DeepRequired, Merge, Path, PathValue} from '../../types'
import {Form} from 'antd'
import {FormInstance} from 'antd/lib/form/Form'
import {FormItemProps} from 'antd/lib/form/FormItem'

/** 表单数据 */
export interface XFormData extends Record<string, any> {}

export type XFormYupSchemaYup = typeof Yup

export interface XFormYupSchemaRef<TData extends XFormData> {
  <K extends keyof TData>(path: Path<DeepRequired<TData>, K>): Yup.Ref,
}

export interface XFormYupSchema<TData extends XFormData> {
  (yup: XFormYupSchemaYup, ref: XFormYupSchemaRef<TData>): {
    [K in keyof TData]?: Yup.Schema<TData[K]>
  },
}

/** 表单属性 */
export interface XFormProps<TData extends XFormData> {
  /** 初始数据 */
  initialData: TData,
  /** Yup 模式 */
  yupSchema?: XFormYupSchema<TData>,
  children(props: XFormChildrenProps<TData>): React.ReactElement,
  /** 提交事件 */
  onSubmit?(data: TData): any,
}

/** 表单实例 */
export interface XFormInstance<TData extends XFormData> extends FormInstance {
  /** 获取数据 */
  getData(): TData,
  /** 设置数据 */
  setData(data: DeepPartial<TData>): void,
  /** 重置数据 */
  resetData(): void,
}

export type XFormItemProps<TKey, TValue> = Merge<FormItemProps, {
  name?: TKey,
  children?: React.ReactNode | (
    (payload: {
      value: TValue,
      onChange(value: TValue): any,
    }) => React.ReactNode
  ),
}>

export type XFormConditionalItemProps<TData extends XFormData> = Merge<FormItemProps, {
  children: (props: {data: TData}) => React.ReactNode,
}>

export interface XFormChildrenProps<TData extends XFormData> {
  /** 表单实例 */
  form: XFormInstance<XFormData>,
  path<TKey extends Path<DeepRequired<TData>, TKey>>(key: TKey): TKey,
  Form: typeof Form,
  FormItem<
    TKey extends Path<DeepRequired<TData>, TKey>,
    TValue extends PathValue<DeepRequired<TData>, TKey>,
  >(props: XFormItemProps<TKey, TValue>): React.ReactElement,
  FormConditionalItem(props: XFormConditionalItemProps<TData>): React.ReactElement,
}
