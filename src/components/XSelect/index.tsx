import React, { useMemo } from 'react'
import { omit } from '../../utils'
import { Select } from 'antd'
import { SelectValue } from 'antd/lib/select'
import { XSelectProps } from './types'

export function XSelect<TValue extends SelectValue>(props: XSelectProps<TValue>) {
  const selectProps = omit(props, ['options'])

  const children = useMemo(() => {
    return props.options.map(function render(item) {
      return Array.isArray((item as any).children)
        ? (
          <Select.OptGroup key={(item as any).key} label={item.label}>
            {render((item as any).children)}
          </Select.OptGroup>
        )
        : (
          <Select.Option
            value={(item as any).value}
            label={(item as any).option ? item.label : undefined}
            optionLabelProp={(item as any).option ? 'label' : 'children'}>
            {(item as any).option || item.label}
          </Select.Option>
        )
    })
  }, [props.options])

  return (
    <Select
      {...selectProps}
      children={children}
    />
  )
}
