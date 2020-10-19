import React, {useState, useEffect} from 'react'

import {View}                            from '@tarojs/components'

import './index.scss'
import classnames                        from 'classnames';
import Taro, {usePageScroll, useDidShow} from '@tarojs/taro';
const NAV_BAR_HEIGHT = 10

const pxTorpx = (px) => px * 750 / wx.getSystemInfoSync().windowWidth;

function Navbar () {
  const [trigger, SetTrigger] = useState(false)
  const [safeAreaTop, SetSafeAreaTop] = useState(NAV_BAR_HEIGHT)
  const [isIPX, SetIsIPX] = useState(false)

  usePageScroll(res => {
    SetTrigger(res.scrollTop > 20 ? true: false)
  })

  useEffect(()=>{
    Taro.setNavigationBarColor({
      frontColor: trigger ? '#000000' : '#ffffff',
      backgroundColor: trigger ? '#fff' : '#000000'
    })
  })

  useDidShow(() => {
    Taro.getSystemInfo().then(res => {
      SetIsIPX(res.model === ('iPhone X'))
      SetSafeAreaTop(res.statusBarHeight)
    })
  })

  const divStyle = {
    paddingTop: `${pxTorpx(NAV_BAR_HEIGHT + safeAreaTop)}rpx`,
  };
  return (
    <View
      style={ divStyle }
      className={ classnames({
      'header-nav-bar'       : true,
      'header-nav-bar--white': trigger,
    }) }>
      <View className={ classnames({
        'header-nav-bar__left-view'       : true,
        'header-nav-bar__left-view--black': trigger,
        'header-nav-bar__left-view--gary' : !trigger
      }) }>
        <View className="icon iconfont icon-left" onClick={ () => {
          Taro.navigateBack({url: `/pages/index/index`})
        } }></View>
      </View>
      <View className="header-nav-bar__title"></View>
    </View>
  )
}

export default Navbar
