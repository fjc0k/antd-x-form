/**
 * title: 表单校验
 * desc: 包含必填、邮箱、数组、引用等。
 */

import React from 'react';
import { Input, InputNumber, Select } from 'antd';
import {
  XForm,
  XRadioButtonOptions,
  XRadioButtonGroup,
  XSelectOptions,
  XSelect,
} from 'antd-x-form';

enum Gender {
  male,
  female,
  they,
}

const genders: XRadioButtonOptions<Gender> = [
  {
    value: Gender.male,
    label: '男',
  },
  {
    value: Gender.female,
    label: '女',
  },
  {
    value: Gender.they,
    label: '其他',
  },
];

enum City {
  beijing,
  shanghai,
  kunming,
  nanning,
}

const cities: XSelectOptions<City> = [
  {
    value: City.beijing,
    label: '北京',
  },
  {
    value: City.shanghai,
    label: '上海',
  },
  {
    value: City.kunming,
    label: '昆明',
  },
  {
    value: City.nanning,
    label: '南宁',
  },
];

export default function() {
  return (
    <XForm
      initialData={{
        nickname: '',
        email: '',
        gender: Gender.female,
        age: (undefined as any) as number,
        address: {
          city: City.kunming,
          full: '',
        },
        tags: [] as string[],
        password: '',
        repeatedPassword: '',
      }}
      labelColSpan={4}
      yupSchema={(_, $) => ({
        nickname: _.string().required(),
        email: _.string()
          .required()
          .email(),
        gender: _.mixed().required(),
        age: _.number()
          .required()
          .min(1),
        address: _.objectOf('address', {
          city: _.mixed().required(),
          full: _.string().required('kkk'),
        }).required('dd'),
        tags: _.array(_.string()).required(),
        password: _.string()
          .required('密码必填')
          .matches(
            /(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9])/,
            '密码必须包含大小写字母、数字、特殊字符',
          )
          .min(8, '密码至少应包含8个字符')
          .max(30, '密码最多包含30个字符'),
        repeatedPassword: _.string()
          .required()
          .oneOf([$('password')], '两次密码应一致'),
      })}>
      {({ path: $, Form, FormItem, FormActionItem, SubmitButton }) => (
        <Form>
          <FormItem label='昵称' name='nickname'>
            <Input placeholder='请输入' />
          </FormItem>
          <FormItem label='邮箱' name='email'>
            <Input placeholder='请输入' />
          </FormItem>
          <FormItem label='性别' name='gender'>
            <XRadioButtonGroup options={genders} />
          </FormItem>
          <FormItem label='年龄' name='age'>
            <InputNumber style={{ width: '100%' }} placeholder='请输入' />
          </FormItem>
          <FormItem
            label='地址'
            name='address'
            dependencies={[$(['address', 'full'])]}>
            <Input.Group compact>
              <FormItem noStyle name={['address', 'city']}>
                <XSelect style={{ width: '5em' }} options={cities} />
              </FormItem>
              <FormItem noStyle name={['address', 'full']}>
                <Input
                  style={{ width: 'calc(100% - 5em)' }}
                  placeholder='详细地址'
                />
              </FormItem>
            </Input.Group>
          </FormItem>
          <FormItem label='标签' name='tags'>
            <Select mode='tags' placeholder='请输入' />
          </FormItem>
          <FormItem label='密码' name='password'>
            <Input.Password placeholder='请输入' />
          </FormItem>
          <FormItem
            label='重复密码'
            name='repeatedPassword'
            dependencies={[$('password')]}>
            <Input.Password placeholder='请输入' />
          </FormItem>
          <FormActionItem>
            <SubmitButton type='primary'>完成注册</SubmitButton>
          </FormActionItem>
        </Form>
      )}
    </XForm>
  );
}
