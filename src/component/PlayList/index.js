import React, {Component} from 'react'

import { View, Text } from '@tarojs/components'

import {AtFloatLayout, AtListItem} from 'taro-ui'

import './index.scss'

import chapters   from '../../assets/chapters.json'
import classnames from 'classnames';

class CPlayList extends Component {
  static options = {
    addGlobalClass: true
  }

  componentWillMount() {
    console.log(this.props.canPlayList)
  }

  doPlaySong(song) {
    this.props.doPlaySong(song)
  }

  renderList() {
    const { canPlayList, list, currentSongInfo, book, chapters, current} = this.props

    return chapters.map((item, index) => {
      return (
        <AtListItem hasBorder={false} className={
          classnames({
            active: item.id == current.id,
            'active-wave': item.id == current.id,
          })
        } key={item.id} title={item.title}/>
      )
    })

  }

  handleClose() {
    this.props.handleClose()
  }
  render() {
    const { isOpened, canPlayList } = this.props
    return (
      <AtFloatLayout
        className={ classnames({
          'custom': true
        }) }
        isOpened={isOpened} title="播放列表" onClose={()=>{ this.handleClose() }}>
        {this.renderList()}
        <View hasBorder={false}   className={ classnames({
          'list-item-center': true
        }) } onClick={()=>{ this.handleClose() }} >关闭</View>
      </AtFloatLayout>
    )
  }
}
export default CPlayList
