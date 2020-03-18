/**
 * title: 基本使用
 * desc: 使用必需的 `options` 属性设置选项列表。
 */

import React, { useState } from 'react'
import { XSelect, XSelectOptions } from 'antd-x-form'

enum Gender { male, female, they }

const genders: XSelectOptions<Gender> = [
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
]

export default function () {
  const [gender, setGender] = useState(Gender.they)

  return (
    <div>
      <XSelect
        options={genders}
        placeholder='请选择您的性别'
      />
      <XSelect
        options={genders}
        defaultValue={Gender.male}
        placeholder='请选择您的性别'
        style={{ marginLeft: 8 }}
      />
      <XSelect
        options={genders}
        value={gender}
        placeholder='请选择您的性别'
        style={{ marginLeft: 8 }}
        onChange={setGender}
      />
    </div>
  )
}
