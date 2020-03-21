/**
 * title: 搜索·
 * desc: 使用 `service` 提供搜索服务。
 */

import React, { useCallback } from 'react'
import { XSelect, XSelectService } from 'antd-x-form'

export default function () {
  const handleSearch: XSelectService<any> = useCallback(async _payload => {
    return [
      {
        label: '鲁班七号',
        value: 'lb7h',
      },
    ]
  }, [])
  return (
    <XSelect
      placeholder='请选择你最喜爱的英雄'
      style={{ width: '100%' }}
      defaultValue={[]}
      service={handleSearch}
    />
  )
}
