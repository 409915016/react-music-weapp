import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'

import './index.scss'
import books   from '../../assets/books.json'
import sources from '../../assets/index.json'

export default class Index extends Component {
  constructor(props){
    super(props)
    this.state = {
      books,
      sources
    }
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  ContentItemClickHandle({book_id}){
    console.log(111)
    Taro.navigateTo({ url: `/pages/player/index?book_id=${book_id}` })
  }

  render () {
    const {books, sources} = this.state
    return (
        <view className="wrapper">
          <view className="header">
            <view className="header__title">
              <text>{ sources.title }</text>
            </view>
            <view className="header__desc">
              <text>{ sources.desc }</text>
              <text>共{ sources.chapters || books.length }本</text>
            </view>
          </view>
          <view className="content">
            {
              books.map(i =>{
                return (
                    <view className="content-item" onClick={this.ContentItemClickHandle.bind({book_id: i.id})}>
                      <view className="content-item__cover">
                        <image mode="aspectFit" src={i.cover_url} alt=""/>
                      </view>
                      <view className="content-item__content">
                        <view className="content-item__content__title">{ i.title }</view>
                        <view className="content-item__content__desc">{ i.desc }</view>
                      </view>
                    </view>
                )
              })
            }
        </view>
  </view>)}
}
