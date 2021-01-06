
const fs = require('fs')
const path = require('path')

const dataDir = path.join(__dirname, '..', 'levels.txt')
function parseLevels (currLevel) {
  const data = fs.readFileSync(dataDir, { encoding: 'utf8' })
  const levels = data.split(/(?:END|END\d+)\s+/g)
  console.log(`${levels.length} loaded`)
  const level = levels[currLevel]
  const lines = level.replace(/ /g, '').split('\r\n')
  const level2d = lines.map(line => line.split(''))
  return level2d
  // const levelChars = level2d.map(row => setImageAndRotation(row))
  // return levelChars
}
function characterLookup (argument0) {
  switch (argument0) {
    case ('X'):
      return [0, 'spr_wall']
    case ('B'):
      return [0, 'spr_boost']
    case ('E'):
      return [180, 'spr_boost']
    case ('e'):
      return [180, 'spr_boost_small']
    case ('M'):
      return [90, 'spr_boost']
    case ('W'):
      return [270, 'spr_boost']
    case ('/'):
      return [135, 'spr_bar']
    case ('-'):
      return [0, 'spr_barh']
    case ('_'):
      return [180, 'spr_barh']
    case ('|'):
      return [90, 'spr_barh']
    case ('I'):
      return [270, 'spr_barh']
    case ('\\'):
      return [45, 'spr_bar']
    case ('G'):
      return [0, 'spr_goal']
    case ('V'):
      return [270, 'spr_ship']
    case ('^'):
      return [180, 'spr_ship']
    case ('n'):
      return [90, 'spr_ship']
    case ('<'):
      return [225, 'spr_ship']
    case ('>'):
      return [315, 'spr_ship']
      // no case matches
    default:
      return undefined
  }
}

function setImageAndRotation (chars) {
  return chars.map(characterLookup)
}

module.exports = parseLevels
