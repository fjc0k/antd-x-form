import React from 'react'
import { FormProps } from 'antd/lib/form'

export interface XFormContextProps {
  layout: FormProps['layout'],
}

export const XFormContext = React.createContext<XFormContextProps>({
  layout: undefined,
})
