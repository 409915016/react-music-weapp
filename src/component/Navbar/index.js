import React, {useState, useEffect } from 'react'

import {View}     from '@tarojs/components'

import './index.scss'
import classnames from 'classnames';
import Taro, {usePageScroll}       from '@tarojs/taro';

function Navbar () {
  const [trigger, SetTrigger] = useState(false)

  usePageScroll(res => {
    console.log(res.scrollTop)
    SetTrigger(res.scrollTop > 20 ? true: false)
  })

  useEffect(()=>{
    Taro.setNavigationBarColor({
      frontColor: trigger ? '#000000' : '#ffffff',
      backgroundColor: trigger ? '#fff' : '#000000'
    })
  })

  return (
    <View className={ classnames({
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
