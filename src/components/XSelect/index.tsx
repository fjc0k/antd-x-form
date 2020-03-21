import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { hasOwn, omit } from '../../utils'
import { Select } from 'antd'
import { SelectProps, SelectValue } from 'antd/lib/select'
import { useRefValue } from '../../hooks'
import { XSelectMultipleProps, XSelectOptions, XSelectProps, XSelectTagsProps } from './types'

export function XSelect<TValue extends SelectValue>(props: XSelectProps<TValue>) {
  const propsRef = useRefValue(props)
  const valueRef = useRefValue(
    hasOwn(props, 'value')
      ? props.value
      : props.defaultValue,
  )

  const selectProps = omit(props, ['options', 'service'])

  const [options, setOptions] = useState<XSelectOptions<TValue>>(props.options || [])

  const handleSearch = useCallback((keyword: string, initial = false) => {
    props.onSearch?.(keyword)
    propsRef.current.service?.({
      keyword: keyword,
      initial: initial,
    }).then(nextOptions => {
      setOptions(options => {
        const mode = (propsRef.current as any as {mode: SelectProps<any>['mode']}).mode
        const isMultipleMode = mode === 'tags' || mode === 'multiple'
        const values: TValue[] = isMultipleMode ? valueRef.current as any : [valueRef.current]
        const reserveOptions = options.filter(function filter(item) {
          if (Array.isArray((item as any).children)) {
            (item as any).children = (item as any).children.filter(filter)
            return (item as any).children.length > 0
          }
          return values.indexOf((item as any).value) > -1
        })
        for (const nextOption of nextOptions) {
          if (Array.isArray((nextOption as any).children)) {
            const children = (
              reserveOptions
                .find(item => item.label === nextOption.label && Array.isArray((item as any).children)) as any
            )
            if (children) {
              for (const item2 of (nextOption as any).children) {
                if (!children.find((item: any) => (item as any).value === (item2 as any).value)) {
                  children.push(item2)
                }
              }
            }
          }
          else {
            if (!reserveOptions.find(item => (item as any).value === (item as any).value)) {
              reserveOptions.push(nextOption)
            }
          }
        }
        return reserveOptions
      })
    })
  }, [])

  const handleChange = useCallback((value: TValue) => {
    valueRef.current = value
    props.onChange?.(value)
  }, [props.onChange])

  useEffect(() => {
    if (propsRef.current.service) {
      handleSearch('', true)
    }
  }, [])

  const children = useMemo(() => {
    return options.map(function render(item) {
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
  }, [options])

  return (
    <Select
      {...selectProps}
      children={children}
      optionLabelProp='label'
      showSearch={true}
      onSearch={handleSearch}
      onChange={handleChange}
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
