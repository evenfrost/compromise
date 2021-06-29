const growFastOr = function (obj, index) {
  let or = obj.regs[index]
  return Array.from(or.fastOr).map(str => {
    return { word: str }
  })
}

const growSlowOr = function (obj, index) {
  let or = obj.regs[index]
  return or.choices.map(regs => {
    if (regs.length === 1) {
      return regs[0]
    }
    return { choices: regs, operator: or.operator }
  })
}

const expand = function (matches) {
  let all = []
  matches.forEach(obj => {
    // expand simple '(one|two)' matches
    let foundOr = obj.regs.findIndex(reg => reg.fastOr)
    if (foundOr !== -1) {
      let more = growFastOr(obj, foundOr)
      more.forEach(mo => {
        let newObj = Object.assign({}, obj) //clone
        newObj.regs = obj.regs.slice(0) //clone
        newObj.regs[foundOr] = mo
        all.push(newObj)
      })
      return
    }
    // expand '(#Foo && two)' matches
    foundOr = obj.regs.findIndex(reg => reg.choices)
    if (foundOr !== -1) {
      let more = growSlowOr(obj, foundOr)
      more.forEach(mo => {
        let newObj = Object.assign({}, obj) //clone
        newObj.regs = obj.regs.slice(0) //clone
        newObj.regs[foundOr] = mo
        all.push(newObj)
      })
      return
    }
    all.push(obj)
  })
  return all
}
module.exports = expand
