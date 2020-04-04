import React from 'react'
import { omit } from '../../utils'
import { Radio } from 'antd'
import { XRadioButtonGroupProps } from './types'

export function XRadioButtonGroup<TValue>(
  props: XRadioButtonGroupProps<TValue>,
) {
  const radioGroupProps = omit(props, ['options'])

  return (
    <Radio.Group {...radioGroupProps}>
      {(props.options || []).map(option => (
        <Radio.Button
          key={String(option.value)}
          value={option.value}
          disabled={option.disabled}>
          {option.label}
        </Radio.Button>
      ))}
    </Radio.Group>
  )
}
