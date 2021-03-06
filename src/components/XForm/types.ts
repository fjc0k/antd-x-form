import * as Yup from 'yup'
import { ButtonProps } from 'antd/lib/button'
import {
  DeepPartial,
  DeepRequired,
  Defined,
  Merge,
  Path,
  PathValue,
  StrictOmit,
} from '../../types'
import { FormInstance, FormProps } from 'antd/lib/form/Form'
import { FormItemProps } from 'antd/lib/form/FormItem'

/** 表单数据 */
export interface XFormData extends Record<string, any> {}

/** Yup 定义提供器 */
export type XFormWrapperYupSchemaProvider<TData extends XFormData> = Merge<
  typeof Yup,
  {
    object<
      TPath extends Path<DeepRequired<TData>, TPath>,
      TValue extends PathValue<DeepRequired<TData>, TPath>
    >(
      path: TPath,
      fields: Yup.ObjectSchemaDefinition<TValue>,
    ): Yup.ObjectSchema<TValue>
  }
>

export interface XFormWrapperYupSchemaRef<TData extends XFormData> {
  <K extends keyof TData>(path: Path<DeepRequired<TData>, K>): Yup.Ref
}

export interface XFormWrapperYupSchema<TData extends XFormData> {
  (
    yup: XFormWrapperYupSchemaProvider<TData>,
    ref: XFormWrapperYupSchemaRef<TData>,
  ): {
    [K in keyof TData]?: Yup.Schema<TData[K]>
  }
}

/** 表单包裹器属性 */
export interface XFormWrapperProps<TData extends XFormData> {
  /** 初始数据 */
  initialData: TData
  /** 标签列栅格数 */
  labelColSpan?: number
  /** Yup 模式 */
  yupSchema?: XFormWrapperYupSchema<TData>
  children(props: XFormWrapperChildrenProps<TData>): React.ReactElement
  /** 提交事件 */
  onSubmit?(data: TData): any
}

/** 表单属性 */
export type XFormProps<TData extends XFormData> = Merge<
  FormProps,
  {
    onDataChange?(payload: {
      changedData: DeepPartial<TData>
      data: TData
      isChanged<TPath extends Path<DeepRequired<TData>, TPath>>(
        path: TPath,
      ): boolean
    }): any
  }
>

/** 表单实例 */
export interface XFormInstance<TData extends XFormData> extends FormInstance {
  /** 获取数据 */
  getData(): TData
  /** 设置数据 */
  setData(data: DeepPartial<TData>): void
  /** 重置数据 */
  resetData(): void
  /** 重置指定字段 */
  resetField<TPath extends Path<DeepRequired<TData>, TPath>>(path: TPath): void
  /** 监听数据变化 */
  listenDataChange: (
    callback: Defined<XFormProps<TData>['onDataChange']>,
  ) => () => void
}

export type XFormItemProps<TPath, TValue> = Merge<
  FormItemProps,
  {
    name?: TPath
    children?:
      | React.ReactNode
      | ((payload: {
          value: TValue
          onChange(value: TValue): any
        }) => React.ReactNode)
  }
>

export type XFormConditionItemProps<TData extends XFormData> = Merge<
  FormItemProps,
  {
    children: (props: { data: TData }) => React.ReactNode
  }
>

export interface XFormWrapperChildrenProps<TData extends XFormData> {
  /** 表单实例 */
  form: XFormInstance<TData>
  path<TPath extends Path<DeepRequired<TData>, TPath>>(path: TPath): TPath
  Form(props: XFormProps<TData>): React.ReactElement
  FormItem<
    TPath extends Path<DeepRequired<TData>, TPath>,
    TValue extends PathValue<DeepRequired<TData>, TPath>
  >(
    props: XFormItemProps<TPath, TValue>,
  ): React.ReactElement
  FormConditionItem(props: XFormConditionItemProps<TData>): React.ReactElement
  FormActionItem(props: FormItemProps): React.ReactElement
  FormPureItem<
    TPath extends Path<DeepRequired<TData>, TPath>,
    TValue extends PathValue<DeepRequired<TData>, TPath>
  >(
    props: StrictOmit<XFormItemProps<TPath, TValue>, 'noStyle'>,
  ): React.ReactElement
  SubmitButton(props: ButtonProps): React.ReactElement
  ResetButton(props: ButtonProps): React.ReactElement
}
