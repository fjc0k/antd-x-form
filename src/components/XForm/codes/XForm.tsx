import React, { useState } from 'react';
import { Button, Input, Switch } from 'antd';
import { XForm } from 'antd-x-form';

export default function() {
  const [data, setData] = useState({
    name: '22',
    pass1: '',
    pass2: '',
    remember: true,
  });

  return (
    <div>
      {JSON.stringify(data)}
      <XForm<typeof data>
        initialData={data}
        yupSchema={(_, $) => ({
          name: _.string().required(),
          pass1: _.string().required(),
          pass2: _.string()
            .oneOf([$('pass1')], '密码错误')
            .required(),
          pass3: _.string(),
        })}
        onSubmit={setData}>
        {({ path, Form, FormItem, FormConditionalItem }) => (
          <Form>
            <FormItem name='name' label='姓名'>
              <Input placeholder='请输入' />
            </FormItem>
            <FormItem name='pass1' label='密码1'>
              <Input placeholder='请输入' />
            </FormItem>
            <FormItem
              name={path('pass2')}
              label='密码2'
              dependencies={[path('pass1')]}>
              <Input placeholder='请输入' />
            </FormItem>
            <FormItem name='remember' label='记住我'>
              {({ value, onChange }) => (
                <Switch checked={value} onChange={onChange} />
              )}
            </FormItem>
            <FormConditionalItem>
              {({ data }) => <Input.TextArea value={JSON.stringify(data)} />}
            </FormConditionalItem>
            <Button htmlType='submit'>提交</Button>
          </Form>
        )}
      </XForm>
    </div>
  );
}
