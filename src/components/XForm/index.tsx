import * as Yup from 'yup';
import React, { useCallback, useMemo } from 'react';
import { castArray, hasOwn } from '../../utils';
import { Form as AntdForm, Button } from 'antd';
import { Rule } from 'antd/lib/form';
import {
  XFormWrapperChildrenProps,
  XFormData,
  XFormWrapperProps,
} from './types';
import { XFormContext } from './context';

export function XForm<TData extends XFormData>(
  props: XFormWrapperProps<TData>,
) {
  const [antdForm] = AntdForm.useForm();

  const form = useMemo((): XFormWrapperChildrenProps<TData>['form'] => {
    return {
      ...antdForm,
      getData() {
        return {
          ...props.initialData,
          ...antdForm.getFieldsValue(true),
        } as any;
      },
      setData(data) {
        return antdForm.setFieldsValue(data);
      },
      resetData() {
        return antdForm.resetFields();
      },
    };
  }, []);

  const path = useMemo((): XFormWrapperChildrenProps<TData>['path'] => {
    return path => path;
  }, []);

  const yupSchema = useMemo(() => {
    if (props.yupSchema) {
      return Yup.object(
        props.yupSchema(
          {
            ...Yup,
            objectOf: (path, schema) => Yup.object(schema),
          },
          path => {
            return Yup.ref(`$${castArray(path as any).join('.')}`);
          },
        ) as any,
      );
    }
  }, []);

  const castData = useCallback((data: TData) => {
    return yupSchema ? yupSchema.cast(data) : data;
  }, []);

  const Form = useMemo((): XFormWrapperChildrenProps<TData>['Form'] => {
    return formProps => {
      return (
        <XFormContext.Provider value={{ layout: formProps.layout }}>
          <AntdForm
            {...(typeof props.labelColSpan !== 'number' ||
            formProps.layout === 'inline' ||
            formProps.layout === 'vertical'
              ? {}
              : {
                  labelCol: { span: props.labelColSpan },
                  wrapperCol: { span: 24 - props.labelColSpan },
                })}
            {...formProps}
            form={antdForm}
            initialValues={props.initialData}
            onValuesChange={(changedData, data) => {
              formProps.onDataChange?.({
                changedData: changedData as any,
                data: data as any,
                isChanged(path) {
                  let lastData = changedData as any;
                  for (const key of castArray(path)) {
                    if (hasOwn(lastData, key as any)) {
                      lastData = lastData[key];
                    } else {
                      return false;
                    }
                  }
                  return true;
                },
              });
              formProps.onValuesChange &&
                formProps.onValuesChange(changedData, data);
            }}
            onFinish={data => props.onSubmit?.(castData(data as any) as any)}
          />
        </XFormContext.Provider>
      );
    };
  }, [props.onSubmit, props.labelColSpan]);

  const FormItem = useMemo((): XFormWrapperChildrenProps<TData>['FormItem'] => {
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
                context: antdForm.getFieldsValue(true),
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
        <AntdForm.Item
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

  const FormConditionItem = useMemo((): XFormWrapperChildrenProps<
    TData
  >['FormConditionItem'] => {
    return formItemProps => (
      <AntdForm.Item {...formItemProps} noStyle={true} shouldUpdate={true}>
        {({ getFieldsValue }) => {
          const data = getFieldsValue(true);
          return formItemProps.children({ data } as any) as any;
        }}
      </AntdForm.Item>
    );
  }, []);

  const FormActionItem = useMemo((): XFormWrapperChildrenProps<
    TData
  >['FormActionItem'] => {
    return formItemProps => {
      const { layout } = React.useContext(XFormContext);
      return (
        <AntdForm.Item
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

  const SubmitButton = useMemo((): XFormWrapperChildrenProps<
    TData
  >['SubmitButton'] => {
    return buttonProps => <Button {...buttonProps} htmlType='submit' />;
  }, []);

  const ResetButton = useMemo((): XFormWrapperChildrenProps<
    TData
  >['ResetButton'] => {
    return buttonProps => (
      <Button {...buttonProps} htmlType='reset' onClick={form.resetData} />
    );
  }, []);

  return (
    <props.children
      path={path}
      form={form}
      Form={Form}
      FormItem={FormItem}
      FormConditionItem={FormConditionItem}
      FormActionItem={FormActionItem}
      SubmitButton={SubmitButton}
      ResetButton={ResetButton}
    />
  );
}
