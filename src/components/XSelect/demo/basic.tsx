/**
 * title: 基本使用
 * desc: 使用必需的 `data` 属性设置选项列表。
 */

import React, { useState } from 'react'
import { XSelect, XSelectData } from 'antd-x-form'

enum Gender {
  male,
  female,
  they,
}

const genders: XSelectData<Gender> = [
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

export default function Demo() {
  const [gender, setGender] = useState(Gender.they)

  return (
    <div>
      <XSelect data={genders} placeholder='请选择您的性别' />
      <XSelect
        data={genders}
        defaultValue={Gender.male}
        placeholder='请选择您的性别'
        style={{ marginLeft: 8 }}
      />
      <XSelect
        data={genders}
        value={gender}
        placeholder='请选择您的性别'
        style={{ marginLeft: 8 }}
        onChange={setGender}
      />
    </div>
  )
}
