import * as Yup from 'yup';
import React, { useCallback, useMemo } from 'react';
import { castArray } from '../../utils';
import { Form, Button } from 'antd';
import { FormProps, Rule } from 'antd/lib/form';
import { XFormChildrenProps, XFormData, XFormProps } from './types';
import { XFormContext } from './context';

export function XForm<TData extends XFormData>(props: XFormProps<TData>) {
  const [form] = Form.useForm();

  const formWrapper = useMemo((): XFormChildrenProps<TData>['form'] => {
    return {
      ...form,
      getData() {
        return form.getFieldsValue(true) as any;
      },
      setData(data) {
        return form.setFieldsValue(data);
      },
      resetData() {
        return form.resetFields();
      },
    };
  }, []);

  const pathWrapper = useMemo((): XFormChildrenProps<TData>['path'] => {
    return key => key;
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
        <XFormContext.Provider value={{ layout: formProps.layout }}>
          <Form
            {...(typeof props.labelColSpan !== 'number' ||
            formProps.layout === 'inline' ||
            formProps.layout === 'vertical'
              ? {}
              : {
                  labelCol: { span: props.labelColSpan },
                  wrapperCol: { span: 24 - props.labelColSpan },
                })}
            {...formProps}
            form={form}
            initialValues={props.initialData}
            onFinish={data => props.onSubmit?.(castData(data as any) as any)}
          />
        </XFormContext.Provider>
      );
    };
    Object.assign(FormWrapper, Form);
    return FormWrapper as any;
  }, [props.onSubmit, props.labelColSpan]);

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

      const { layout } = React.useContext(XFormContext);

      return (
        <Form.Item
          {...(typeof props.labelColSpan !== 'number' ||
          !!formItemProps.label ||
          layout === 'inline' ||
          layout === 'vertical'
            ? {}
            : {
                wrapperCol: {
                  offset: props.labelColSpan,
                },
              })}
          {...(formItemProps as any)}
          children={children}
          required={required}
          rules={rules}
        />
      );
    };
  }, [props.labelColSpan]);

  const FormConditionItemWrapper = useMemo((): XFormChildrenProps<
    TData
  >['FormConditionItem'] => {
    return formItemProps => (
      <Form.Item {...formItemProps} noStyle={true} shouldUpdate={true}>
        {({ getFieldsValue }) => {
          const data = getFieldsValue(true);
          return formItemProps.children({ data } as any) as any;
        }}
      </Form.Item>
    );
  }, []);

  const FormActionItemWrapper = useMemo((): XFormChildrenProps<
    TData
  >['FormActionItem'] => {
    return formItemProps => {
      const { layout } = React.useContext(XFormContext);
      return (
        <Form.Item
          {...(typeof props.labelColSpan !== 'number' ||
          layout === 'inline' ||
          layout === 'vertical'
            ? {}
            : {
                wrapperCol: {
                  offset: props.labelColSpan,
                  span: 24 - props.labelColSpan,
                },
              })}
          {...formItemProps}
        />
      );
    };
  }, [props.labelColSpan]);

  const SubmitButtonWrapper = useMemo((): XFormChildrenProps<
    TData
  >['SubmitButton'] => {
    return buttonProps => <Button {...buttonProps} htmlType='submit' />;
  }, []);

  const ResetButtonWrapper = useMemo((): XFormChildrenProps<
    TData
  >['ResetButton'] => {
    return buttonProps => (
      <Button
        {...buttonProps}
        htmlType='reset'
        onClick={formWrapper.resetData}
      />
    );
  }, []);

  return (
    <props.children
      path={pathWrapper}
      form={formWrapper}
      Form={FormWrapper}
      FormItem={FormItemWrapper}
      FormConditionItem={FormConditionItemWrapper}
      FormActionItem={FormActionItemWrapper}
      SubmitButton={SubmitButtonWrapper}
      ResetButton={ResetButtonWrapper}
    />
  );
}
