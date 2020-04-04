import { StrictOmit } from '../../types'
import { SwitchProps } from 'antd/lib/switch'

export interface XSwitchProps extends SwitchProps {
  /**
   * 当前是否选中。
   *
   * @default false
   */
  value?: boolean,

  /**
   * 初始是否选中。
   *
   * @default false
   */
  defaultValue?: boolean,
}

export type XSwitchYesNoProps = StrictOmit<XSwitchProps, 'checkedChildren' | 'unCheckedChildren'>

export type XSwitchOnOffProps = StrictOmit<XSwitchProps, 'checkedChildren' | 'unCheckedChildren'>

export type XSwitchOpenCloseProps = StrictOmit<XSwitchProps, 'checkedChildren' | 'unCheckedChildren'>
