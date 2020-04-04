import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { hasOwn, omit } from '../../utils'
import { isSelectGroup } from './utils'
import { Select, Spin } from 'antd'
import { SelectProps, SelectValue } from 'antd/lib/select'
import { useDebounce, useRefValue } from '../../hooks'
import {
  XSelectData,
  XSelectGroup,
  XSelectMultipleProps,
  XSelectProps,
  XSelectTagsProps,
} from './types'

export function XSelect<TValue extends SelectValue>(
  props: XSelectProps<TValue>,
) {
  const propsRef = useRefValue(props)
  const valueRef = useRefValue(
    hasOwn(props, 'value') ? props.value : props.defaultValue,
  )

  const [loading, setLoading] = useState(!!props.service)

  const selectProps = omit(props, ['data', 'service'])
  const extraSelectProps = useMemo((): SelectProps<TValue> => {
    return !props.service
      ? {}
      : {
          showSearch: true,
          notFoundContent: loading ? <Spin /> : null,
          onSearch: handleSearch,
        }
  }, [!!props.service, loading])

  const [data, setData] = useState<XSelectData<TValue>>(props.data || [])

  const handleSearch = useDebounce((keyword: string, initial = false) => {
    props.onSearch?.(keyword)
    setLoading(true)
    propsRef.current
      .service?.({
        keyword: keyword,
        initial: initial,
      })
      .then(nextData => {
        setData(currentData => {
          const mode = ((propsRef.current as any) as {
            mode: SelectProps<any>['mode']
          }).mode
          const isMultipleMode = mode === 'tags' || mode === 'multiple'
          const values: TValue[] = isMultipleMode
            ? (valueRef.current as any)
            : [valueRef.current]
          const data = currentData.filter(function filter(itemOrGroup) {
            if (isSelectGroup(itemOrGroup)) {
              itemOrGroup.children = itemOrGroup.children.filter(filter)
              return itemOrGroup.children.length > 0
            }
            return values.includes(itemOrGroup.value)
          })
          for (const itemOrGroup of nextData) {
            if (isSelectGroup(itemOrGroup)) {
              const existingGroup: XSelectGroup<any> | undefined = data.find(
                item =>
                  isSelectGroup(item) &&
                  (hasOwn(item, 'key')
                    ? item.key === itemOrGroup.key
                    : item.label === itemOrGroup.label),
              ) as any
              if (!existingGroup) {
                data.push(itemOrGroup)
              } else {
                existingGroup.children.push(
                  ...itemOrGroup.children.filter(item => {
                    return !existingGroup.children.find(
                      existingItem => existingItem.value === item.value,
                    )
                  }),
                )
              }
            } else {
              if (
                !data.find(
                  item =>
                    !isSelectGroup(item) && item.value === itemOrGroup.value,
                )
              ) {
                data.push(itemOrGroup)
              }
            }
          }
          return data
        })
        setLoading(false)
      })
  }, 800)

  const handleChange = useCallback(
    (value: TValue) => {
      valueRef.current = value
      props.onChange?.(value)
    },
    [props.onChange],
  )

  useEffect(() => {
    if (propsRef.current.service) {
      handleSearch('', true)
    }
  }, [])

  const children = useMemo(() => {
    return data.map(function render(item) {
      return isSelectGroup(item) ? (
        <Select.OptGroup
          key={`group_${item.key ?? item.label}`}
          label={item.label}>
          {item.children.map(render)}
        </Select.OptGroup>
      ) : (
        <Select.Option
          key={`item_${item.value}`}
          value={item.value as any}
          label={item.label ?? item.option}>
          {item.option ?? item.label}
        </Select.Option>
      )
    })
  }, [data])

  return (
    <Select
      {...extraSelectProps}
      {...selectProps}
      children={children}
      optionLabelProp='label'
      onChange={handleChange}
    />
  )
}

XSelect.Multiple = function XSelectMultiple<TValue extends SelectValue>(
  props: XSelectMultipleProps<TValue>,
) {
  return (
    <XSelect<any>
      {...props}
      // @ts-ignore
      mode='multiple'
    />
  )
}

XSelect.Tags = function XSelectTags<TValue extends SelectValue>(
  props: XSelectTagsProps<TValue>,
) {
  return (
    <XSelect<any>
      {...props}
      // @ts-ignore
      mode='tags'
    />
  )
}
