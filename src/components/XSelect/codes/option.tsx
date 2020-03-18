/**
 * title: 自定义选项内容
 * desc: 使用 `options[].option` 自定义选项内容。
 */

import React from 'react'
import { AlipayOutlined, WechatOutlined, ZhihuOutlined } from '@ant-design/icons'
import { Row } from 'antd'
import { XSelect, XSelectOptions } from 'antd-x-form'

enum App { wechat, alipay, zhihu }

const apps: XSelectOptions<App> = [
  {
    value: App.wechat,
    label: '微信',
    option: (
      <Row justify='space-between' align='middle'>
        <span>微信</span>
        <WechatOutlined />
      </Row>
    ),
  },
  {
    value: App.alipay,
    label: '支付宝',
    option: (
      <Row justify='space-between' align='middle'>
        <span>支付宝</span>
        <AlipayOutlined />
      </Row>
    ),
  },
  {
    value: App.zhihu,
    label: '知乎',
    option: (
      <Row justify='space-between' align='middle'>
        <span>知乎</span>
        <ZhihuOutlined />
      </Row>
    ),
  },
]

export default function () {
  return (
    <div>
      <XSelect
        options={apps}
        placeholder='请选择您最喜爱的应用'
        style={{ width: 200 }}
      />
    </div>
  )
}