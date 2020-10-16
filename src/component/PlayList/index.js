import React, {Component} from 'react'

import {View} from '@tarojs/components'

import {AtFloatLayout, AtListItem} from 'taro-ui'

import './index.scss'
import classnames                  from 'classnames';

class CPlayList extends Component {

  componentWillMount () {
    //console.log(this.props.canPlayList)
  }

  doPlaySong (song) {
    this.props.doPlaySong(song)
  }

  renderList () {
    const { chapters, current } = this.props

    return chapters.map(item => {
      return (
        <AtListItem hasBorder={ false } className={
          classnames({
            active       : item.id == current.id,
            'active-wave': item.id == current.id,
          })
        } onClick={ () => {
          this.doPlaySong(item.id);
          this.handleClose()
        } } key={ item.id } title={ item.title }/>
      )
    })

  }

  handleClose () {
    this.props.handleClose()
  }

  render () {
    const {isOpened} = this.props
    return (
      <AtFloatLayout
        className={ classnames({
          'custom': true
        }) }
        isOpened={ isOpened } title="播放列表" onClose={ () => {
        this.handleClose()
      } }>
        { this.renderList() }
        <View hasBorder={ false } className={ classnames({
          'list-item-center': true
        }) } onClick={ () => {
          this.handleClose()
        } }>关闭</View>
      </AtFloatLayout>
    )
  }
}

export default CPlayList
