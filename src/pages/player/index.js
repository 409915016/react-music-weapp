import React, {Component} from 'react'

import Taro, {getCurrentInstance} from '@tarojs/taro'
import {View, Image, Slider}      from '@tarojs/components'

import books    from '../../assets/books.json'
import chapters from '../../assets/chapters.json'

import {timeLengthFormator} from '../../utils'

import './index.scss'

import ajh from '../../assets/images/ajh.png'
import ajd from '../../assets/images/ajd.png'
import ajf from '../../assets/images/ajf.png'
import ajb from '../../assets/images/ajb.png'

const backgroundAudioManager = Taro.getBackgroundAudioManager()

export default class Index extends Component {
  constructor (props) {
    super(props)
    this.state = {
      book        : {title: '', cover_url: ''},
      chapter     : {title: ''},
      options     : {
        chapters,
      },
      currentyTime: 0,
      playPercent : 0,
      //isPlaying: props.song.isPlaying,
      isPlaying   : false,
      isOpened    : false

    }
  }

  setSongInfo (songInfo) {
    try {
      const {name, al, url, lrcInfo} = songInfo
      Taro.setNavigationBarTitle({
        title: name
      })
      backgroundAudioManager.title       = name
      backgroundAudioManager.coverImgUrl = al.picUrl
      backgroundAudioManager.src         = url
      this.setState({
        lrc       : lrcInfo,
        isPlaying : true,
        firstEnter: false
      });
    } catch (err) {
      console.log('err', err)
      this.getNextSong()
    }
  }

  pauseMusic () {
    backgroundAudioManager.pause()
    this.setState({
      isPlaying: false
    })
  }

  playMusic () {
    backgroundAudioManager.play()
    this.setState({
      isPlaying: true
    })
  }


  updateProgress (currentPosition) {
    const {dt} = this.props.song.currentSongInfo
    this.setState({
      playPercent: currentPosition * 1000 * 100 / dt
    })
  }

  componentWillMount () {
    const book_id    = getCurrentInstance().router.params.book_id || 1;
    const chapter_id = getCurrentInstance().router.params.chapter_id || 10;
    this.setState({book: books.find(i => i.id == book_id)})
    this.setState({chapter: chapters.find(i => i.book_id == book_id)})

    let that = this
    // fix 点击同一首歌重新播放bug
    Taro.getBackgroundAudioPlayerState({
      success (res) {
        if (res.status !== 2) {
          that.setState({
            isPlaying: true,
          })
          timer = setInterval(() => {
            that.setState({
              currentyTime: backgroundAudioManager.currentTime
            })

            that.updateProgress(backgroundAudioManager.currentTime)
          }, 300)
        }
      }
    })

  }

  componentDidMount () {

    const that = this
    const {id} = that.$router.params
    this.props.getSongInfo({
      id
    })

    backgroundAudioManager.onPause(() => {
      this.onPause()
    })
    backgroundAudioManager.onPlay(() => {
      that.setState({
        isPlaying: true
      })
      const timer = setInterval(() => {
        if (!this.state.isPlaying) return
        this.setState({
          currentyTime: backgroundAudioManager.currentTime
        })
        this.updateLrc(backgroundAudioManager.currentTime)
        this.updateProgress(backgroundAudioManager.currentTime)
      }, 300)
    })
    backgroundAudioManager.onEnded(() => {
      const {playMode}   = this.props.song
      const routes       = Taro.getCurrentPages()
      const currentRoute = routes[routes.length - 1].route
      // 如果在当前页面则直接调用下一首的逻辑，反之则触发nextSong事件
      this.playByMode(playMode)
    })
  }

  onPause () {
    clearInterval(timer)
    this.setState({
      isPlaying: false
    })
  }

  percentChange (e) {
    this.onPause()
    const {value}       = e.detail
    const {dt}          = this.props.song.currentSongInfo
    let currentPosition = Math.floor((dt / 1000) * value / 100)
    backgroundAudioManager.seek(currentPosition)
    backgroundAudioManager.play()
  }

  percentChanging () {
    this.onPause()
    backgroundAudioManager.pause()
  }

  // 获取下一首
  getNextSong () {
    const {currentSongIndex, canPlayList, playMode} = this.props.song
    let nextSongIndex                               = currentSongIndex + 1
    if (playMode === 'shuffle') {
      this.getShuffleSong()
      return
    }
    if (currentSongIndex === canPlayList.length - 1) {
      nextSongIndex = 0
    }
    this.props.getSongInfo({
      id: canPlayList[nextSongIndex].id
    })
  }

  handleCPlayList () {
    this.setState({
      isOpened: !this.state.isOpened
    })
  }

  // 获取上一首
  getPrevSong () {
    const {currentSongIndex, canPlayList, playMode} = this.props.song
    let prevSongIndex                               = currentSongIndex - 1
    if (playMode === 'shuffle') {
      this.getShuffleSong()
      return
    }
    if (currentSongIndex === 0) {
      prevSongIndex = canPlayList.length - 1
    }
    this.props.getSongInfo({
      id: canPlayList[prevSongIndex].id
    })
  }


  componentWillUnmount () {
    // 更新下播放状态
    this.props.updateState({
      isPlaying: this.state.isPlaying
    })
  }

  componentDidShow () {
  }

  componentDidHide () {
  }

  render () {
    const {book, chapter, currentyTime, playPercent, isPlaying} = this.state

    return (
      <view className="player-wrapper">
        <view className="player-wrapper__bg"></view>
        <view className="player-content">

          <view className="player-content__title">
            <text>{ book.title }</text>
          </view>
          <view className="player-content__desc">
            <text> { chapter.title }</text>
          </view>

          <view className="player-content__cover">
            <Image src={ book.cover_url }/>

          </view>

          <view className="player-content__time">
            <view className='time-left'>
              { timeLengthFormator(currentyTime * 1000) }
            </view>
            <Slider className='time-line' tep={ 0.01 } value={ playPercent } activeColor='#fff' backgroundColor='#888'
                    blockColor='#fff' blockSize={ 18 }
                    onChange={ () => {
                      this.percentChange()
                    } } onChanging={ () => {
              this.percentChanging()
            } }></Slider>
            <view className='time-right'>
              { timeLengthFormator(chapter.dt * 1000) }
            </view>

          </view>

          <view className="player-content__bottom">
            <View className='icon iconfont icon-chukou' onClick={ () => {
              this.handleCPlayList()
            } }></View>
            <Image
              src={ ajh }
              className='song__operation__prev'
              onClick={ () => {
                this.getPrevSong
              } }
            />
            {
              isPlaying ? <Image src={ ajd } className='song__operation__play' onClick={ () => {
                  this.pauseMusic
                } }/> :
                <Image src={ ajf } className='song__operation__play' onClick={ () => {
                  this.pauseMusic
                } }/>
            }
            <Image
              src={ ajb }
              className='song__operation__next'
              onClick={ () => {
                this.getNextSong
              } }
            />
            <View className='icon iconfont icon-chukou' onClick={ () => {
              this.handleCPlayList()
            } }></View>
          </view>
        </view>
      </view>)
  }
}
