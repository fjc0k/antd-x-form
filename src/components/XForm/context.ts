import { FormProps } from 'antd/lib/form';
import React from 'react';

export interface XFormContextProps {
  layout: FormProps['layout'];
}

export const XFormContext = React.createContext<XFormContextProps>({
  layout: undefined,
});
