import React from 'react'
import { hasOwn, omit } from '../../utils'
import { Switch } from 'antd'
import { XSwitchProps } from './types'

export function XSwitch(props: XSwitchProps) {
  const switchProps = omit(props, ['value', 'defaultValue'])
  if (hasOwn(props, 'value')) {
    switchProps.checked = props.value
  }
  else if (hasOwn(props, 'defaultValue')) {
    switchProps.defaultChecked = props.defaultValue
  }
  return <Switch {...switchProps} />
}

XSwitch.YesNo = function (props: XSwitchProps) {
  return (
    <XSwitch
      {...props}
      checkedChildren='是'
      unCheckedChildren='否'
    />
  )
}

XSwitch.OnOff = function (props: XSwitchProps) {
  return (
    <XSwitch
      {...props}
      checkedChildren='开'
      unCheckedChildren='关'
    />
  )
}

XSwitch.OpenClose = function (props: XSwitchProps) {
  return (
    <XSwitch
      {...props}
      checkedChildren='开启'
      unCheckedChildren='关闭'
    />
  )
}
