/**
 * title: 搜索·
 * desc: 使用 `service` 提供搜索服务。
 */

import React, { useCallback } from 'react'
import { XSelect, XSelectService } from 'antd-x-form'
import { XSelectData } from '../types'

enum Hero {
  蒙犽 = '蒙犽',
  伽罗 = '伽罗',
  铠 = '铠',
  后羿 = '后羿',
  孙悟空 = '孙悟空',
  亚瑟 = '亚瑟',
  韩信 = '韩信',
  安琪拉 = '安琪拉',
  甄姬 = '甄姬',
  鲁班七号 = '鲁班七号',
  妲己 = '妲己',
  沈梦溪 = '沈梦溪',
  兰陵王 = '兰陵王',
  王昭君 = '王昭君',
  典韦 = '典韦',
  夏侯惇 = '夏侯惇',
  庄周 = '庄周',
  盘古 = '盘古',
  鲁班大师 = '鲁班大师',
  西施 = '西施',
  曜 = '曜',
  马超 = '马超',
  嫦娥 = '嫦娥',
  上官婉儿 = '上官婉儿',
  猪八戒 = '猪八戒',
  孙策 = '孙策',
  盾山 = '盾山',
  李信 = '李信',
  云中君 = '云中君',
  瑶 = '瑶',
  米莱狄 = '米莱狄',
  狂铁 = '狂铁',
  裴擒虎 = '裴擒虎',
  明世隐 = '明世隐',
  公孙离 = '公孙离',
  梦奇 = '梦奇',
  弈星 = '弈星',
  百里守约 = '百里守约',
  百里玄策 = '百里玄策',
  苏烈 = '苏烈',
  黄忠 = '黄忠',
  大乔 = '大乔',
  诸葛亮 = '诸葛亮',
  鬼谷子 = '鬼谷子',
  东皇太一 = '东皇太一',
  太乙真人 = '太乙真人',
  蔡文姬 = '蔡文姬',
  雅典娜 = '雅典娜',
  干将莫邪 = '干将莫邪',
  哪吒 = '哪吒',
  女娲 = '女娲',
  杨戬 = '杨戬',
  成吉思汗 = '成吉思汗',
  杨玉环 = '杨玉环',
  钟馗 = '钟馗',
  虞姬 = '虞姬',
  李元芳 = '李元芳',
  张飞 = '张飞',
  刘备 = '刘备',
  牛魔 = '牛魔',
  橘右京 = '橘右京',
  娜可露露 = '娜可露露',
  不知火舞 = '不知火舞',
  张良 = '张良',
  花木兰 = '花木兰',
  刘邦 = '刘邦',
  姜子牙 = '姜子牙',
  露娜 = '露娜',
  程咬金 = '程咬金',
  貂蝉 = '貂蝉',
  关羽 = '关羽',
  老夫子 = '老夫子',
  司马懿 = '司马懿',
  武则天 = '武则天',
  项羽 = '项羽',
  达摩 = '达摩',
  狄仁杰 = '狄仁杰',
  马可波罗 = '马可波罗',
  李白 = '李白',
  宫本武藏 = '宫本武藏',
  曹操 = '曹操',
  元歌 = '元歌',
  周瑜 = '周瑜',
  吕布 = '吕布',
  芈月 = '芈月',
  白起 = '白起',
  扁鹊 = '扁鹊',
  孙膑 = '孙膑',
  钟无艳 = '钟无艳',
  阿轲 = '阿轲',
  高渐离 = '高渐离',
  刘禅 = '刘禅',
  孙尚香 = '孙尚香',
  嬴政 = '嬴政',
  墨子 = '墨子',
  赵云 = '赵云',
  小乔 = '小乔',
  廉颇 = '廉颇',
}

export default function Demo() {
  const handleSearch: XSelectService<any> = useCallback(async payload => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(
          Object.keys(Hero)
            .filter(hero => hero.includes(payload.keyword))
            .map<XSelectData<Hero>[0]>(hero => ({
              label: hero,
              value: (Hero as any)[hero],
            })),
        )
      }, 2000)
    })
  }, [])

  return (
    <XSelect.Multiple
      placeholder='请选择你最喜爱的英雄'
      style={{ width: '100%' }}
      defaultValue={[]}
      service={handleSearch}
    />
  )
}
