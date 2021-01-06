'use strict'
let canvas
let context
let levelChars
let drawing = false
let button = 0
let selectedCharacter = '/'
let waterLevel = -1
const scale = 0.5
let currentLevel = 0

const lookup = {
  spr_bar: document.getElementById('spr_bar'),
  spr_barh: document.getElementById('spr_barh'),
  spr_boost: document.getElementById('spr_boost'),
  spr_boost_small: document.getElementById('spr_boost_small'),
  spr_goal: document.getElementById('spr_goal'),
  spr_ship: document.getElementById('spr_ship'),
  spr_wall: document.getElementById('spr_wall'),
  spr_hole: document.getElementById('spr_hole'),
  spr_target: document.getElementById('spr_target')
}

function addClicks () {
  for (const element of document.getElementsByTagName('span')) {
    console.log(element.innerHTML)
    element.addEventListener('mousedown', (e) => {
      selectedCharacter = element.innerHTML.replace('&gt;', '>').replace('&lt;', '<')
    })
  }
}

window.onload = init

function characterLookup (argument0) {
  switch (argument0) {
    case ('X'):
      return [0, 'spr_wall']
    case ('H'):
      return [0, 'spr_hole']
    case ('B'):
      return [0, 'spr_boost']
    case ('b'):
      return [0, 'spr_boost_small']
    case ('E'):
      return [180, 'spr_boost']
    case ('e'):
      return [180, 'spr_boost_small']
    case ('%'):
      return [315, 'spr_boost_small']
    case ('£'):
      return [135, 'spr_boost_small']
    case ('$'):
      return [45, 'spr_boost_small']
    case ('#'):
      return [225, 'spr_boost_small']
    case ('M'):
      return [90, 'spr_boost']
    case ('m'):
      return [90, 'spr_boost_small']
    case ('W'):
      return [270, 'spr_boost']
    case ('w'):
      return [270, 'spr_boost_small']
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
      return [135, 'spr_ship']
    case ('n'):
      return [90, 'spr_ship']
    case ('<'):
      return [225, 'spr_ship']
    case ('>'):
      return [315, 'spr_ship']
    case ('T'):
      return [0, 'spr_target']
    case (')'):
      return [0, 'spr_curve']
    case ('('):
      return [90, 'spr_curve']
      // no case matches
    default:
      return undefined
  }
}

function setImageAndRotation (chars) {
  return chars.map(characterLookup)
}

function drawSquare (c, r) {
  context.save()
  context.beginPath()
  context.strokeStyle = '#AAAAAA'
  context.rect(c * 32, r * 32, 32, 32)
  context.stroke()
  context.restore()
}
function drawWater () {
  if (waterLevel > -1) {
    context.save()
    context.strokeStyle = '#6DD0F7'
    context.fillStyle = '#6DD0F7'
    context.globalAlpha = 0.3
    context.fillRect(0, waterLevel * 32, 32 * levelChars[0].length, 32 * (levelChars[0].length - waterLevel))
    context.restore()
  }
}

function drawRotatedImage (c, r, image, angle) {
  context.save()
  context.translate(c * 32, r * 32)
  context.rotate(-angle * Math.PI / 180)
  context.drawImage(image, -image.width / 2, -image.height / 2)
  context.restore()
}

function drawImage (c, r, image) {
  context.drawImage(image, (c * 32) - (image.width / 2), (r * 32) - (image.height / 2))
}

function reverseSlashes (line) {
  return line.map(c => {
    switch (c) {
      case ('/'):
        return '\\'
      case ('\\'):
        return '/'
      default:
        return c
    }
  })
}

function drawTile (canvas, event) {
  if (drawing) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const c = Math.floor((x + 8) / 16)
    const r = Math.floor((y + 8) / 16)
    const ch = button === 0 ? selectedCharacter : '0'
    levelChars[r] = levelChars[r] && levelChars[r].length > 0 ? levelChars[r] : Array(levelChars[0].length).fill(0)
    if (c > levelChars[r].length) {
      levelChars[r] = levelChars[r].concat(Array(c - levelChars[r].length).fill('0')
      )
    }
    levelChars[r][c] = ch
    drawLevel()
    const text = levelChars.join('\n').replaceAll(',', ' ')
    const reversed = levelChars.map(reverseSlashes).reverse().join('\n').replaceAll(',', ' ')
    document.getElementById('levelAscii').value = text + '\n\n REVERSE \n\n' + reversed
  }
}

function getWaterLevel () {
  for (let i = 0; i < levelChars.length; i++) {
    if (levelChars[i].includes('~')) {
      return i
    }
  }
  return -1
}

function drawLevel () {
  waterLevel = getWaterLevel()
  console.log(waterLevel)
  const level = levelChars.map(row => setImageAndRotation(row))
  context.canvas.width = level[0].length * 32 * scale
  context.canvas.height = level.length * 32 * scale
  context.scale(scale, scale)
  context.clearRect(0, 0, canvas.width / scale, canvas.height / scale)
  for (let r = 0; r < level.length; r++) {
    if (level[r] === undefined) continue
    for (let c = 0; c < level[r].length; c++) {
      drawSquare(c, r)
      const item = level[r][c]
      if (item) {
        const image = lookup[item[1]]
        if (item[0] > 0) {
          drawRotatedImage(c, r, image, item[0])
        } else {
          drawImage(c, r, image)
        }
      }
    }
  }

  drawWater()
}

function setupCanvas () {
  canvas = document.getElementById('canvas')
  canvas.addEventListener('mousedown', (e) => {
    drawing = true
    button = e.button
    drawTile(canvas, e)
  })
  canvas.addEventListener('mousemove', (e) => {
    drawTile(canvas, e)
  })
  canvas.addEventListener('mouseup', (e) => {
    drawing = false
  })

  context = canvas.getContext('2d')
  context.scale(scale, scale)
}

function fetchLevel () {
  fetch(`/level/${currentLevel}`)
    .then(res => res.json())
    .then((out) => {
      levelChars = out
      drawLevel()
    })
    .catch(err => { throw err })
}

function addSelectChange () {
  const levelSelect = document.getElementById('levels')
  currentLevel = levelSelect.value
  levelSelect.addEventListener('change', event => {
    currentLevel = event.target.value
    fetchLevel()
  })
}

function init () {
  addSelectChange()
  setupCanvas()
  fetchLevel()
  addClicks()
}
