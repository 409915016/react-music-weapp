import React, {Component} from 'react'
import { connect } from 'react-redux'

import Taro, {getCurrentInstance}  from '@tarojs/taro'
import {View, Text, Image, Slider} from '@tarojs/components'

import PlayList    from '../../component/PlayList'
import PlayContent from '../../component/PlayContent'
import Layout      from '../../component/Layout'

import books    from '../../assets/books.json'
import chapters from '../../assets/chapters.json'

import {timeLengthFormator} from '../../utils'

import './index.scss'
import ajd                  from '../../assets/images/ajd.png'
import ajf                  from '../../assets/images/ajf.png'

const backgroundAudioManager = Taro.getBackgroundAudioManager()

let timer

class Player extends Component {
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
      isPlaying   : false,
      isOpened    : false,
      firstEnter  : true,
      isStop      : false

    }
  }

  component

  componentWillMount () {

    let that = this

    backgroundAudioManager.onPause(() => {
      console.log('onPause')
      this.onPause()
    })
    backgroundAudioManager.onStop(() => {
      console.log('onStop')
      this.setState({
        isStop: true
      })
      this.onPause()
    })
    backgroundAudioManager.onPlay(() => {
      this.setState({
        isPlaying: true
      })
      const timer = setInterval(() => {
        if (!this.state.isPlaying) return
        this.setState({
          currentyTime: backgroundAudioManager.currentTime
        })
        this.updateProgress(backgroundAudioManager.currentTime)
      }, 300)
    })
    backgroundAudioManager.onEnded(() => {
      this.getNextSong()
    })

    const book_id    = getCurrentInstance().router.params.book_id || 1;
    const chapter_id = getCurrentInstance().router.params.chapter_id || 10;
    this.setState({book: books.find(i => i.id == book_id)})
    this.setState({chapter: chapters.find(i => i.book_id == book_id)})

    Taro.getBackgroundAudioPlayerState({
      success (res) {
        if (res.status == 1) {

          that.setState({
            isPlaying: true,
          })
          that.setState({chapter: chapters.find(i => i.url == res.dataUrl)})
          timer = setInterval(() => {
            that.setState({
              currentyTime: backgroundAudioManager.currentTime
            })

            that.updateProgress(backgroundAudioManager.currentTime)
          }, 300)
        } else if( res.status == 0){
          that.setState({
            isPlaying: false,
          })
        }
      },
      fail (err) {
        that.setState({
          isPlaying: false,
        })
      }

    })
  }

  componentDidMount () {
  }

  componentWillUnmount () {
  }

  componentDidUpdate (prevProps, {firstEnter, book, chapter, currentyTime, playPercent, isPlaying, isOpened, options}) {

    if (this.state.chapter.id !== chapter.id || this.state.firstEnter) {
      this.setState({
        firstEnter: false,
      })

      Taro.getStorage({
        key    : 'playing',
        success: ({data}) => {
          if (!data) {
            this.setSongInfo(this.state.chapter)
          }
        }
      })

    }
  }

  setSongInfo (songInfo) {

    const {title, url, thumb}    = songInfo
    backgroundAudioManager.title = title
    backgroundAudioManager.src = url
    backgroundAudioManager.coverImgUrl = thumb
    try {
      this.setState({
        isPlaying : true,
        firstEnter: false
      });
    } catch (err) {
      console.log('err', err)
      //this.getNextSong()
    }
  }

  pauseMusic () {
    backgroundAudioManager.pause()
    Taro.setStorage({
      key: 'playing',
      data: false
    })
  }

  playMusic () {
    if(this.state.isStop) {
      const {title, url, thumb}    = this.state.chapter
      backgroundAudioManager.title = title
      backgroundAudioManager.src = url
      backgroundAudioManager.coverImgUrl = thumb
      this.setState({
        isStop: false
      })
    }
    backgroundAudioManager.play()
    Taro.setStorage({
      key: 'playing',
      data: true
    })
    this.setState({
      isPlaying: true,
    })
  }

  onStop() {
    clearInterval(timer)
    // backgroundAudioManager.pause()

    this.setState({
      isPlaying: false,
      firstEnter: true,
    })
    Taro.setStorage({
      key: 'playing',
      data: false
    })

    // const {title, url, thumb}    = this.state.chapter
    // backgroundAudioManager.title = title
    // backgroundAudioManager.src = url
    // backgroundAudioManager.coverImgUrl = thumb
  }

  onPause () {
    clearInterval(timer)
    this.setState({
      isPlaying: false,
      firstEnter: false
    })
  }

  percentChange ({detail}) {
    this.onPause()
    const {dt}          = this.state.chapter
    let currentPosition = Math.floor((dt / 1000) * detail.value / 100)
    this.updateProgress(currentPosition)
    backgroundAudioManager.seek(currentPosition)
    backgroundAudioManager.play()
  }

  percentChanging () {
    this.onPause()
    backgroundAudioManager.pause()
  }

  getNextSong () {
    const {id, canPlayList} = this.state.chapter
    let nextSongId          = id + 1
    if (nextSongId >= 15) nextSongId = 10
    this.setState({
      chapter: chapters.find(i => i.id == nextSongId)
    })
    this.setSongInfo(chapters.find(i => i.id == nextSongId))
  }

  getPrevSong () {
    const {id, canPlayList} = this.state.chapter
    let nextSongId          = id - 1
    if (nextSongId <= 9) nextSongId = 14
    this.setState({
      chapter: chapters.find(i => i.id == nextSongId)
    })
    this.setSongInfo(chapters.find(i => i.id == nextSongId))
  }

  handleCPlayList () {
    this.setState({
      isOpened: !this.state.isOpened
    })
  }

  updateProgress (currentPosition) {
    const {dt} = this.state.chapter
    this.setState({
      playPercent: Math.floor(currentPosition * 1000 * 100 / dt)
    })
  }

  doPlaySong (id) {
    if (id == this.state.chapter.id) return
    this.setState({
      chapter: chapters.find(i => i.id == id)
    })
    this.setSongInfo(chapters.find(i => i.id == id))
  }

  render () {
    const {book, chapter, currentyTime, playPercent, isPlaying, isOpened, options} = this.state

    return (

      <Layout>
        <View className="player-wrapper">
          <View className="player-content">
            <View className="player-content__title">
              <Text>{ book.title }</Text>
            </View>
            <View className="player-content__desc">
              <Text> { chapter.title }</Text>
            </View>
            <View className="player-content__cover">
              <Image src={ book.cover_url }/>

            </View>
            <View className="player-content__time">
              <View className='time-left'>
                { timeLengthFormator(currentyTime * 1000) }
              </View>
              <Slider className='time-line' tep={ 0.01 } value={ playPercent } activeColor='#fff' backgroundColor='#888'
                      blockColor='#fff' blockSize={ 18 }
                      onChange={ (e) => {
                        this.percentChange(e)
                      } } onChanging={ (e) => {
                this.percentChanging(e)
              } }>
              </Slider>
              <View className='time-right'>
                { timeLengthFormator(chapter.dt) }
              </View>

            </View>

            <View className="player-content__bottom">
              <View onClick={ () => {
                this.handleCPlayList()
              } }>
                <View className='icon iconfont icon-list'></View>
                <Text className='player-content__bottom-text'>列表</Text>
              </View>
              <View
                className='icon iconfont icon-prev'
                onClick={ () => {
                  this.getPrevSong()
                } }
              />
              {
                isPlaying ? <View src={ ajd } className='icon iconfont icon-pause' onClick={ () => {
                    this.pauseMusic()
                  } }/> :
                  <View src={ ajf } className='icon iconfont icon-play' onClick={ () => {
                    this.playMusic()
                  } }/>
              }
              <View
                className='icon iconfont icon-next'
                onClick={ () => {
                  this.getNextSong()
                } }
              />
              <View>
                <View className='icon iconfont icon-share'></View>
                <Text className='player-content__bottom-text'>分享</Text>
              </View>
            </View>

          </View>

          <PlayContent
            current={ chapter }
            book={ book } chapters={ options.chapters }
            handleClose={ () => {
              this.handleCPlayList()
            } }
          />

          <PlayList isOpened={ isOpened }
                    chapters={ options.chapters }
                    current={ chapter }
                    handleClose={ () => {
                      this.handleCPlayList()
                    } }
                    doPlaySong={ (id) => {
                      this.doPlaySong(id)
                    } }/>
        </View>
      </Layout>

    )
  }
}

const mapStateToProps = (state) =>{
  return {
    player: state.player
  }
}

export default connect(mapStateToProps)(Player)
