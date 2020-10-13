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
    Taro.navigateTo({ url: `/pages/player/index?book_id=${book_id}` })
  }

  render () {
    const {books, sources} = this.state

    return (
        <View className="wrapper">
          <View className="header">
            <View className="header__title">
              <Text>{ sources.title }</Text>
            </View>
            <View className="header__desc">
              <Text>{ sources.desc }</Text>
              <Text>共{ sources.chapters || books.length }本</Text>
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
