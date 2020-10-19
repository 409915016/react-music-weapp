import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'

import './index.scss'
import books   from '../../assets/books.json'
import sources from '../../assets/index.json'
import chapters from '../../assets/chapters.json'

import {playAudio} from '../../utils'

export default class Index extends Component {
  constructor(props){
    super(props)
    this.state = {
      books,
      sources,
    }
  }
  onPause(){
    Taro.setStorage({
      key: 'playing',
      data: false
    })
  }
  onPlay(song) {
    Taro.setStorage({
      key: 'playing',
      data: true
    })

    const backgroundAudioManager = Taro.getBackgroundAudioManager()

    backgroundAudioManager.onStop(() => {
      this.onPause()
    })

    try {
      const {title, url, thumb}          = song
      backgroundAudioManager.title       = title
      backgroundAudioManager.src         = url
      backgroundAudioManager.coverImgUrl = thumb
    } catch (err) {
      console.log('err', err)
    }
  }

  componentDidMount () {
    const that = this
    // const book_id = 1
    // Taro.navigateTo({ url: `/pages/player/index?book_id=${book_id}` })
    Taro.getBackgroundAudioPlayerState({
      success (res) {
        if (res.status !== 2) { //played on background
          that.onPlay(chapters[0])
        }
      },
      fail (res) {
        that.onPlay(chapters[0])
      }
    })
  }

  ContentItemClickHandle({book_id}){
    const that = this

    Taro.getBackgroundAudioPlayerState({
      success (res) {
        if (res.status !== 2) { //played on background
          Taro.setStorage({
            key: 'playing',
            data: true
          })
        } else {
          that.onPlay(chapters[0])
        }
      },
      fail (res) {
        Taro.setStorage({
          key: 'playing',
          data: false
        })
      }
    })

    Taro.navigateTo({ url: `/pages/player/index?book_id=${book_id}&from=index` })
  }

  render () {
    const {books, sources} = this.state

    return (
        <View className="wrapper">
          <View className="header">
            <View className="header__title">
              <Text>{ sources.title }</Text>
            </View>
            <View className="at-row at-row__align--center at-row__justify--between header__desc">
              <View className='at-col'>
                <Text>{ sources.desc }</Text>
              </View>
              <View className='at-col at-col-1 at-col--auto'>
                <Text className='icon iconfont icon-book'>
                </Text>
                <Text className='book-text'>共{ sources.chapters || books.length }本</Text>
              </View>
            </View>
          </View>
          <View className="content">
            {
              books.map(i =>{
                return (
                    <View className="content-item" onClick={()=>{ this.ContentItemClickHandle({book_id: i.id}) }}>
                      <View className="content-item__cover">
                        <image mode="aspectFit" src={i.cover_url} alt=""/>
                      </View>
                      <View className="content-item__content">
                        <View className="content-item__content__title">{ i.title }</View>
                        <View className="content-item__content__desc">{ i.desc }</View>
                      </View>
                    </View>
                )
              })
            }
        </View>
  </View>)
  }
}
