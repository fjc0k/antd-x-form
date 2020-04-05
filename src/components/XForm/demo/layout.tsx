/**
 * title: 表单布局
 * desc: 表单有三种布局。
 */

import React, { useState } from 'react'
import { Checkbox, Input } from 'antd'
import { FormProps } from 'antd/lib/form'
import { XForm, XRadioButtonGroup, XRadioButtonOptions } from 'antd-x-form'

const layouts: XRadioButtonOptions<FormProps['layout']> = [
  {
    value: 'vertical',
    label: 'vertical',
  },
  {
    value: 'horizontal',
    label: 'horizontal',
  },
  {
    value: 'inline',
    label: 'inline',
  },
]

export default function Demo() {
  return (
    <XForm
      initialData={{
        layout: 'horizontal' as FormProps['layout'],
        account: {
          user: '',
          pass: '',
        },
        remember: false,
      }}
      labelColSpan={4}
      yupSchema={_ => ({
        layout: _.mixed().required(),
        account: _.object('account', {
          user: _.string().required(),
          pass: _.string().required(),
        }).required(),
        remember: _.boolean().required(),
      })}>
      {({
        form,
        Form,
        FormItem,
        FormActionItem,
        SubmitButton,
        ResetButton,
      }) => {
        const [layout, setLayout] = useState(() => form.getData().layout)

        return (
          <Form
            layout={layout}
            onDataChange={({ data, isChanged }) => {
              if (isChanged('layout')) {
                setLayout(data.layout)
              }
            }}>
            <FormItem label='布局类型' name='layout'>
              <XRadioButtonGroup options={layouts} />
            </FormItem>
            <FormItem name={['account', 'user']} label='用户名'>
              <Input placeholder='请输入' />
            </FormItem>
            <FormItem name={['account', 'pass']} label='密码'>
              <Input.Password placeholder='请输入' />
            </FormItem>
            <FormItem name='remember'>
              {({ value, onChange }) => (
                <Checkbox
                  checked={value}
                  onChange={e => onChange(e.target.checked)}>
                  记住我
                </Checkbox>
              )}
            </FormItem>
            <FormActionItem>
              <SubmitButton type='primary'>立即登录</SubmitButton>
              <ResetButton style={{ marginLeft: 8 }}>重置</ResetButton>
            </FormActionItem>
          </Form>
        )
      }}
    </XForm>
  )
}
