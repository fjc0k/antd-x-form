import * as Yup from 'yup';
import React, { useCallback, useMemo } from 'react';
import { castArray } from '../../utils';
import { Form } from 'antd';
import { FormProps, Rule } from 'antd/lib/form';
import { XFormChildrenProps, XFormData, XFormProps } from './types';

export function XForm<TData extends XFormData>(props: XFormProps<TData>) {
  const [form] = Form.useForm();

  const formWrapper = useMemo((): XFormChildrenProps<TData>['form'] => {
    return {
      ...form,
      getData() {
        return form.getFieldsValue(true);
      },
      setData(data) {
        return form.setFieldsValue(data);
      },
      resetData() {
        return form.resetFields();
      },
    };
  }, []);

  const yupSchema = useMemo(() => {
    if (props.yupSchema) {
      return Yup.object(
        props.yupSchema(Yup, path => {
          return Yup.ref(`$${castArray(path as any).join('.')}`);
        }) as any,
      );
    }
  }, []);

  const castData = useCallback((data: TData) => {
    return yupSchema ? yupSchema.cast(data) : data;
  }, []);

  const FormWrapper = useMemo((): XFormChildrenProps<TData>['Form'] => {
    const FormWrapper = (formProps: FormProps) => {
      return (
        <Form
          {...formProps}
          form={form}
          initialValues={props.initialData}
          onFinish={data => props.onSubmit?.(castData(data as any) as any)}
        />
      );
    };
    Object.assign(FormWrapper, Form);
    return FormWrapper as any;
  }, [props.onSubmit]);

  const FormItemWrapper = useMemo((): XFormChildrenProps<TData>['FormItem'] => {
    return formItemProps => {
      const schema = useMemo(() => {
        if (yupSchema) {
          try {
            return Yup.reach(
              yupSchema,
              castArray(formItemProps.name as any).join('.'),
            );
          } catch (err) {}
        }
      }, [formItemProps.name]);

      const required = useMemo(() => {
        return (
          formItemProps.required ||
          !!(schema && (schema as any)?._exclusive?.required)
        );
      }, [formItemProps.required, schema]);

      const rules = useMemo((): Rule[] => {
        const rules: Rule[] = [];
        if (Array.isArray(formItemProps.rules)) {
          rules.push(...formItemProps.rules);
        }
        if (schema) {
          rules.push({
            validator(rule, value) {
              return schema.validate(value, {
                context: form.getFieldsValue(true),
              }) as any;
            },
          });
        }
        return rules;
      }, [formItemProps.rules, schema]);

      const children = useMemo(() => {
        if (typeof formItemProps.children === 'function') {
          const Child = formItemProps.children as any;
          return <Child />;
        }
        return formItemProps.children;
      }, [formItemProps.children]);

      return (
        <Form.Item
          {...(formItemProps as any)}
          children={children}
          required={required}
          rules={rules}
        />
      );
    };
  }, []);

  const FormConditionalItemWrapper = useMemo((): XFormChildrenProps<
    TData
  >['FormConditionalItem'] => {
    return formItemProps => (
      <Form.Item {...formItemProps} noStyle={true} shouldUpdate={true}>
        {({ getFieldsValue }) => {
          const data = getFieldsValue(true);
          return formItemProps.children({ data } as any) as any;
        }}
      </Form.Item>
    );
  }, []);

  const pathWrapper = useMemo((): XFormChildrenProps<TData>['path'] => {
    return key => key;
  }, []);

  return (
    <props.children
      path={pathWrapper}
      form={formWrapper}
      Form={FormWrapper}
      FormItem={FormItemWrapper}
      FormConditionalItem={FormConditionalItemWrapper}
    />
  );
}
