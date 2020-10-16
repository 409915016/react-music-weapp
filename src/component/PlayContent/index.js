import React, {Component} from 'react'

import {View} from '@tarojs/components'

import {AtList, AtListItem} from 'taro-ui'

import './index.scss'
import classnames           from 'classnames'

import thumb from '../../assets/images/thumb.jpg'

class PlayContent extends Component {

  componentWillMount () {
  }

  doPlaySong (song) {
    this.props.doPlaySong(song)
  }

  handleClose () {
    this.props.handleClose()
  }

  renderList () {
    const {book, chapters, current} = this.props

    return chapters.map((item, index) => {
      return (
        <AtListItem className={
          classnames({
            active      : item.id == current.id,
            'custom-all': true
          })
        } key={ item.id } title={ item.title }/>
      )
    })

  }

  render () {
    const {book, chapter} = this.props
    return (
      <View className='play-content'>
        <AtList>
          <AtListItem className='play-content-menu'
                      thumb={ thumb }
                      title={ book.title } note={ book.desc }/>
          <View className='play-content-text play-content-text--title'>【目录】</View>
          { this.renderList() }
        </AtList>

        <View className='play-content-more' onClick={ () => {
          this.handleClose()
        } }>
          { `查看更多 >` }
        </View>

        <View className='play-content-text play-content-text--title'>【简介】</View>

        <View className='play-content-text'>
          2013年末，在北京西山，一座无名英雄纪念广场建成，用以纪念1950年代在台湾牺牲的中共地下工作者，这是官方第一次以纪念广场的形式公开纪念那段历史，846个名字被镌刻在石壁上。旁边一段铭文这样记录他们--“风萧水寒，旌霜履血，或成或败，或囚或殁，人不知之，乃至陨后无名。”
        </View>

        <View className='play-content-text'>
          在过去的91年历史中，无数中共隐蔽战线的人们，用汗水、鲜血，乃至生命践行着这段铭文。
        </View>

        <View className='play-content-text'>
          揭开历史的迷雾,他们的传奇往事呈现于世人面前,足以让任何谍战影视黯然失色。
        </View>

        <View className='play-content-text'>
          而更为让人敬仰的，是他们忠于自己的信仰以数十年有限生命，立亿万年不朽事业，虽败犹荣，虽死无悔。
        </View>
      </View>
    )
  }
}

export default PlayContent
