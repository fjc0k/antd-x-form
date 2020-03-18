import React, { useState } from 'react'
import { XSwitch } from 'antd-x-form'

export default function () {
  const [on, setOn] = useState(false)

  return (
    <XSwitch.OnOff
      value={on}
      onChange={setOn}
    />
  )
}
