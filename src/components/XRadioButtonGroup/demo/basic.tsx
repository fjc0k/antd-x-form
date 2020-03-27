import React from 'react'
import { XRadioButtonGroup, XRadioButtonOptions } from 'antd-x-form'

export default function () {
  type ICity = 'bj' | 'sh' | 'sz' | 'cd'

  const cities: XRadioButtonOptions<ICity> = [
    {
      value: 'bj',
      label: '北京',
    },
    {
      value: 'sh',
      label: '上海',
    },
    {
      value: 'sz',
      label: '深圳',
    },
    {
      value: 'cd',
      label: '成都',
    },
  ]

  return (
    <XRadioButtonGroup<ICity>
      options={cities}
      defaultValue='sh'
    />
  )
}
