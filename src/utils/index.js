export const timeLengthFormator = (time) => {
  let min = Math.floor(time/1000/60)
  let sec = Math.floor((time - min*60*1000)/1000)
  return `${min>9?min:'0'+min}:${sec>9?sec:'0'+sec}`
}