import * as Yup from 'yup'
import React, {useCallback, useMemo} from 'react'
import {castArray} from '../../utils'
import {Form} from 'antd'
import {FormProps, Rule} from 'antd/lib/form'
import {XFormChildrenProps, XFormData, XFormProps} from './types'

export function XForm<TData extends XFormData>(props: XFormProps<TData>) {
  const [form] = Form.useForm()

  const formWrapper = useMemo((): XFormChildrenProps<TData>['form'] => {
    return {
      ...form,
      getData() {
        return form.getFieldsValue(true)
      },
      setData(data) {
        return form.setFieldsValue(data)
      },
      resetData() {
        return form.resetFields()
      },
    }
  }, [form])

  const yupSchema = useMemo(() => {
    if (props.yupSchema) {
      return Yup.object(
        props.yupSchema(Yup, path => {
          return `$${castArray(path as any).join('.')}`
        }) as any,
      )
    }
  }, [props.yupSchema])

  const castData = useCallback((data: TData) => {
    return yupSchema
      ? yupSchema.cast(data)
      : data
  }, [yupSchema])

  const FormWrapper = useMemo((): XFormChildrenProps<TData>['Form'] => {
    const FormWrapper = (formProps: FormProps) => {
      return (
        <Form
          {...formProps}
          form={form}
          initialValues={props.initialData}
          onFinish={data => props.onSubmit?.(castData(data as any) as any)}
        />
      )
    }
    Object.assign(FormWrapper, Form)
    return FormWrapper as any
  }, [props.onSubmit, castData, form])

  const FormItemWrapper = useMemo((): XFormChildrenProps<TData>['FormItem'] => {
    return formItemProps => {
      const schema = useMemo(() => {
        return yupSchema
          && Yup.reach(
            yupSchema,
            castArray(formItemProps.name as any).join('.'),
          )
      }, [formItemProps.name])

      const required = useMemo(() => {
        return formItemProps.required
          || !!(schema && (schema as any)?._exclusive?.required)
      }, [formItemProps.required, schema])

      const rules = useMemo((): Rule[] => {
        const rules: Rule[] = []
        if (Array.isArray(formItemProps.rules)) {
          rules.push(...formItemProps.rules)
        }
        if (schema) {
          rules.push({
            validator(rule, value) {
              return schema.validate(value, {
                context: {},
              }) as any
            },
          })
        }
        return rules
      }, [formItemProps.rules, schema])

      return (
        <Form.Item
          {...formItemProps as any}
          required={required}
          rules={rules}
        />
      )
    }
  }, [yupSchema])

  const FormConditionalItemWrapper = useMemo((): XFormChildrenProps<TData>['FormConditionalItem'] => {
    return formItemProps => (
      <Form.Item
        {...formItemProps}
        noStyle={true}
        shouldUpdate={true}>
        {({getFieldsValue}) => {
          const data = getFieldsValue(true)
          return formItemProps.children({data} as any) as any
        }}
      </Form.Item>
    )
  }, [])

  return (
    <props.children
      form={formWrapper}
      Form={FormWrapper}
      FormItem={FormItemWrapper}
      FormConditionalItem={FormConditionalItemWrapper}
    />
  )
}
