/**
 * title: 基本使用
 * desc: 包括布局、初始化、校验、提交、重置。
 */

import React from 'react';
import { Input, Checkbox, Modal } from 'antd';
import { XForm } from 'antd-x-form';

export default function() {
  return (
    <XForm
      initialData={{
        user: '',
        pass: '',
        remember: true,
      }}
      labelColSpan={4}
      yupSchema={_ => ({
        user: _.string().required(),
        pass: _.string().required(),
        remember: _.boolean().required(),
      })}
      onSubmit={data => {
        Modal.success({
          title: '登录成功',
          content: (
            <div>
              {`用户名：${data.user}`}
              <br />
              {`密　码：${data.pass}`}
              <br />
              {`记住我：${String(data.remember)}`}
            </div>
          ),
        });
      }}>
      {({ Form, FormItem, FormActionItem, SubmitButton, ResetButton }) => (
        <Form>
          <FormItem name='user' label='用户名'>
            <Input placeholder='请输入' />
          </FormItem>
          <FormItem name='pass' label='密码'>
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
      )}
    </XForm>
  );
}
