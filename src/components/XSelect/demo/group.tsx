/**
 * title: 选项分组
 * desc: 使用 `data[].children` 定义分组。
 */

import React from 'react'
import { XSelect, XSelectData } from 'antd-x-form'

enum App {
  wechat,
  weibo,
  dingding,
  github,
  gitlab,
}

const apps: XSelectData<App> = [
  {
    label: '社交',
    children: [
      {
        value: App.wechat,
        label: '微信',
      },
      {
        value: App.weibo,
        label: '微博',
      },
      {
        value: App.dingding,
        label: '钉钉',
      },
    ],
  },
  {
    label: '打码',
    children: [
      {
        value: App.github,
        label: 'GitHub',
      },
      {
        value: App.gitlab,
        label: 'GitLab',
      },
    ],
  },
]

export default function Demo() {
  return (
    <div>
      <XSelect.Tags
        data={apps}
        placeholder='请选择您最喜爱的应用'
        style={{ width: '100%' }}
      />
    </div>
  )
}
