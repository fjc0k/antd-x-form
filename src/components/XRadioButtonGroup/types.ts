import { Merge } from '../../types'
import { RadioGroupProps } from 'antd/lib/radio'

export interface XRadioButtonItem<TValue> {
  label: React.ReactNode
  value: TValue
  disabled?: boolean
}

export type XRadioButtonOptions<TValue> = Array<XRadioButtonItem<TValue>>

export type XRadioButtonGroupProps<TValue> = Merge<
  RadioGroupProps,
  {
    options: XRadioButtonOptions<TValue>
    value?: TValue
    defaultValue?: TValue
  }
>
