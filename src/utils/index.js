import Taro from '@tarojs/taro';

export const timeLengthFormator = (time) => {
  let min = Math.floor(time/1000/60)
  let sec = Math.floor((time - min*60*1000)/1000)
  return `${min>9?min:'0'+min}:${sec>9?sec:'0'+sec}`
}

export const playAudio = (song) => {
  const backgroundAudioManager = Taro.getBackgroundAudioManager()

  try {
    const {title, url, thumb}          = song
    backgroundAudioManager.title       = title
    backgroundAudioManager.src         = url
    backgroundAudioManager.coverImgUrl = thumb
  } catch (err) {
    console.log('err', err)
  }
}