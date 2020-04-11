import React, { useCallback, useState } from 'react'
import { Button, Divider, Input, message, Space, Tag } from 'antd'
import { range, wait } from 'vtils'
import { useXTable } from '../hooks'
import { XTable } from 'antd-x-form'
import { XTableFilterItem } from '../types'

interface Hero {
  id: number
  name: string
  height: number
  address: string
  tags: string[]
}

interface GetHerosRequest {
  pageNumber: number
  pageSize: number
  filter: {
    [K in keyof Hero]?: Hero[K] extends Array<infer X> ? X[] : Hero[K][]
  }
  sorter: {
    [K in keyof Hero]?: 'desc' | 'asc' | undefined
  }
  searcher: {
    [K in keyof Hero]?: string
  }
}

interface GetHerosResponse {
  total: number
  list: Hero[]
}

const deletedHeros = new Set<number>()

const getHeros = (payload: GetHerosRequest) => {
  const total = 996
  const heros = range(0, total).map<Hero>(i => ({
    id: i + 1,
    name: `${['鲁班', '貂蝉', '孙尚香', '安琪拉', '孙悟空'][i % 5]}${i + 1}号`,
    height: [150, 170, 165, 155, 180][i % 5],
    address: `峡谷${[1, 5, 3, 9, 10][i % 5]}号地块`,
    tags: [['小书包', '法刺', '大小姐', '萝莉', '齐天大圣'][i % 5]],
  }))
  return new Promise<GetHerosResponse>(resolve => {
    setTimeout(() => {
      const filteredHeros = heros.filter(hero => {
        return (
          !deletedHeros.has(hero.id) &&
          (payload.filter.name
            ? payload.filter.name.some(name => hero.name.startsWith(name))
            : true) &&
          (payload.filter.address
            ? payload.filter.address.some(address =>
                hero.address.startsWith(address),
              )
            : true) &&
          (payload.searcher.name
            ? hero.name.includes(payload.searcher.name)
            : true)
        )
      })
      resolve({
        total: filteredHeros.length,
        list: filteredHeros
          .sort((a, b) => {
            return !payload.sorter.height
              ? 0
              : payload.sorter.height === 'asc'
              ? a.height - b.height
              : b.height - a.height
          })
          .slice(
            (payload.pageNumber - 1) * payload.pageSize,
            (payload.pageNumber - 1) * payload.pageSize + payload.pageSize,
          ),
      })
    }, 1000)
  })
}

export default function Demo() {
  const heroTable = useXTable()
  const [heroNames, setHeroNames] = useState<string[]>([])
  const [name, setName] = useState('')

  const handleGetHerosClick = useCallback(() => {
    setHeroNames(['鲁班', '貂蝉', '孙尚香', '安琪拉', '孙悟空'])
  }, [])

  return (
    <Space style={{ width: '100%' }} direction='vertical'>
      <Space direction='horizontal'>
        <Button type='primary' onClick={handleGetHerosClick}>
          获取英雄
        </Button>
        <Button onClick={() => heroTable.toggleLoading()}>切换加载状态</Button>
        <Button onClick={() => heroTable.refresh()}>刷新</Button>
        <Button onClick={() => heroTable.reset()}>重置</Button>
      </Space>
      <Input.Search
        defaultValue={name}
        placeholder='输入姓名关键词搜索'
        onSearch={keyword => setName(keyword)}
      />
      <XTable<Hero>
        ref={heroTable.ref}
        dataSourceDependencies={[name]}
        dataSource={async payload => {
          const heros = await getHeros({
            pageNumber: payload.pagination.pageNumber,
            pageSize: payload.pagination.pageSize,
            filter: payload.filter,
            sorter: payload.sorter,
            searcher: {
              name: name,
            },
          })
          return {
            total: heros.total,
            data: heros.list,
          }
        }}
        extraPropsDependencies={[heroNames]}
        extraProps={({ path: $, table }) => ({
          rowKey: $('id'),
          pagination: {
            pageSize: 2,
          },
          columns: [
            {
              key: $('id'),
              title: 'ID',
              render: item => item.id,
            },
            {
              key: $('name'),
              title: '姓名',
              filterMultiple: false,
              filters: heroNames.map<XTableFilterItem>(name => ({
                label: name,
                value: name,
              })),
              render: item => item.name,
            },
            {
              key: $('height'),
              title: '身高',
              render: item => item.height,
              sorter: true,
            },
            {
              key: $('address'),
              title: '地址',
              filters: [1, 5, 3, 9, 10].map<XTableFilterItem>(i => ({
                label: `峡谷${i}号地块`,
                value: `峡谷${i}号地块`,
              })),
              render: item => item.address,
            },
            {
              key: $('tags'),
              title: '标签',
              render: item => item.tags.map(tag => <Tag key={tag}>{tag}</Tag>),
            },
            {
              key: '$action',
              title: '操作',
              render: item => (
                <span>
                  <a>编辑</a>
                  <Divider type='vertical' />
                  <a
                    onClick={async () => {
                      table.toggleLoading()
                      await wait(1000)
                      deletedHeros.add(item.id)
                      await table.refresh()
                      message.success('删除成功')
                    }}>
                    删除
                  </a>
                </span>
              ),
            },
          ],
        })}
      />
    </Space>
  )
}
