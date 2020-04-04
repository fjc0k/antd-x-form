import React from 'react'
import { hasOwn } from '../../utils'
import { Switch } from 'antd'
import {
  XSwitchOnOffProps,
  XSwitchOpenCloseProps,
  XSwitchProps,
  XSwitchYesNoProps,
} from './types'

export function XSwitch(props: XSwitchProps) {
  const { value, defaultValue, ...switchProps } = props
  if (hasOwn(props, 'value')) {
    switchProps.checked = value
  } else if (hasOwn(props, 'defaultValue')) {
    switchProps.defaultChecked = defaultValue
  }
  return <Switch {...switchProps} />
}

XSwitch.YesNo = function (props: XSwitchYesNoProps) {
  return <XSwitch {...props} checkedChildren='是' unCheckedChildren='否' />
}

XSwitch.OnOff = function (props: XSwitchOnOffProps) {
  return <XSwitch {...props} checkedChildren='开' unCheckedChildren='关' />
}

XSwitch.OpenClose = function (props: XSwitchOpenCloseProps) {
  return <XSwitch {...props} checkedChildren='开启' unCheckedChildren='关闭' />
}
