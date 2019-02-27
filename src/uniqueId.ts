
export const uniqueInt = (() =>{
  let inc : number = 0
  let timeStamp : number = 0
  return () => {
    let now = (new Date).getTime()
    if (timeStamp < now) {
      timeStamp = now
      inc = 0
    } else {
      if (++inc > 999) {
        timeStamp++
        inc = 0
      }
    }
    let res = (timeStamp * 1000 + inc) // @NOTE int 16
    res = (timeStamp * 1000 + inc)
    return res
  }
})()

export const uniqueStr = () => uniqueInt().toString(36)
