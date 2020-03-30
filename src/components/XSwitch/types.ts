import { StrictOmit } from '../../types'
import { SwitchProps } from 'antd/lib/switch'

export interface XSwitchProps extends SwitchProps {
  value?: boolean,
  defaultValue?: boolean,
}

export type XSwitchYesNoProps = StrictOmit<XSwitchProps, 'checkedChildren' | 'unCheckedChildren'>

export type XSwitchOnOffProps = StrictOmit<XSwitchProps, 'checkedChildren' | 'unCheckedChildren'>

export type XSwitchOpenCloseProps = StrictOmit<XSwitchProps, 'checkedChildren' | 'unCheckedChildren'>
