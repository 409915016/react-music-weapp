import React, {useState, useEffect, useLayoutEffect} from 'react'
import {View, Text}                                  from '@tarojs/components'
import Taro                                          from '@tarojs/taro'
import { connect } from 'react-redux'

import './index.scss'
import _books                                        from '../../assets/books.json'
import _sources                                      from '../../assets/index.json'
import _chapters                                     from '../../assets/chapters.json'
import Navbar                                        from "../../component/Navbar";

const backgroundAudioManager = Taro.getBackgroundAudioManager()

const pauseMusic = () => {
  Taro.setStorage({
    key : 'playing',
    data: false
  })
}

const onPlay = (song) => {
  Taro.setStorage({
    key : 'playing',
    data: true
  })

  if(process.env.TARO_ENV !== 'weapp') {
    return
  }

  try {
    const {title, url, thumb}          = song
    backgroundAudioManager.title       = title
    backgroundAudioManager.src         = url
    backgroundAudioManager.coverImgUrl = thumb
  } catch (err) {
    console.log('err', err)
  }
}

const ContentItemClickHandle = ({book_id}) => {

  if(process.env.TARO_ENV !== 'weapp') {
    return
  }

  Taro.getBackgroundAudioPlayerState({
    success(res) {
      if (res.status !== 2) { //played on background
        Taro.setStorage({
          key : 'playing',
          data: true
        })
      } else {
        onPlay(chapters[0])
      }
    },
    fail(res) {
      Taro.setStorage({
        key : 'playing',
        data: false
      })
    }
  })

  Taro.navigateTo({url: `/pages/player/index?book_id=${book_id}&from=index`})
}

const Index = ({player}) => {
  const [books, SetBooks]       = useState(_books)
  const [sources, SetSources]   = useState(_sources)
  const [chapters, SetChapters] = useState(_chapters)



  useLayoutEffect(() => {

    if(process.env.TARO_ENV !== 'weapp') {
      return
    }

    console.log(player)

    backgroundAudioManager.onStop(() => {
      this.pauseMusic()
    })

    Taro.getBackgroundAudioPlayerState({
      success(res) {
        if (res.status !== 2) { //played on background
          Taro.setStorage({
            key : 'playing',
            data: true
          })
        } else {
          onPlay(chapters[0])
        }
      },
      fail(res) {
        onPlay(chapters[0])
      }
    })
  })

  return (
    <View className="wrapper">
      <View className="header">
        <View className="header__title">
          <Text>{sources.title}</Text>
        </View>
        <View className="at-row at-row__align--center at-row__justify--between header__desc">
          <View className='at-col'>
            <Text>{sources.desc}</Text>
          </View>
          <View className='at-col at-col-1 at-col--auto'>
            <Text className='icon iconfont icon-book'>
            </Text>
            <Text className='book-text'>共{sources.chapters || books.length}本</Text>
          </View>
        </View>
      </View>
      <View className="content">
        {
          books.map(i => {
            return (
              <View className="content-item" onClick={() => {
                ContentItemClickHandle({book_id: i.id})
              }}>
                <View className="content-item__cover">
                  <image mode="aspectFit" src={i.cover_url} alt=""/>
                </View>
                <View className="content-item__content">
                  <View className="content-item__content__title">{i.title}</View>
                  <View className="content-item__content__desc">{i.desc}</View>
                </View>
              </View>
            )
          })
        }
      </View>
    </View>)

}

const mapStateToProps = (state) =>{
  return {
    player: state.player
  }
}

export default connect(mapStateToProps)(Index)
