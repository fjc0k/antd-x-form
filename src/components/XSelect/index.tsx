import React, { useMemo } from 'react'
import { omit } from '../../utils'
import { Select } from 'antd'
import { SelectValue } from 'antd/lib/select'
import { XSelectMultipleProps, XSelectProps, XSelectTagsProps } from './types'

export function XSelect<TValue extends SelectValue>(props: XSelectProps<TValue>) {
  const selectProps = omit(props, ['options'])

  const children = useMemo(() => {
    return props.options.map(function render(item) {
      return Array.isArray((item as any).children)
        ? (
          <Select.OptGroup
            key={(item as any).key || item.label as any}
            label={item.label}>
            {(item as any).children.map(render)}
          </Select.OptGroup>
        )
        : (
          <Select.Option
            key={(item as any).value}
            value={(item as any).value}
            label={item.label || (item as any).option}>
            {(item as any).option || item.label}
          </Select.Option>
        )
    })
  }, [props.options])

  return (
    <Select
      {...selectProps}
      children={children}
      optionLabelProp='label'
    />
  )
}

XSelect.Multiple = function XSelectMultiple<TValue extends SelectValue>(props: XSelectMultipleProps<TValue>) {
  return (
    <XSelect<any>
      {...props}
      // @ts-ignore
      mode='multiple'
    />
  )
}

XSelect.Tags = function XSelectTags<TValue extends SelectValue>(props: XSelectTagsProps<TValue>) {
  return (
    <XSelect<any>
      {...props}
      // @ts-ignore
      mode='tags'
    />
  )
}
