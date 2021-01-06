'use strict'
let canvas
let context
const stepSize = 32
const scale = 0.5

const path = []

let startX = 20
let startY = 20

const maxSteps = 100

const directions = [0, 45, 90, 135, 180, 225, 270, 315]
let direction = 45

window.onload = init

function drawSquare (c, r) {
  context.save()
  context.beginPath()
  context.strokeStyle = '#AAAAAA'
  context.rect(c * 32, r * 32, 32, 32)
  context.stroke()
  context.restore()
}

function drawPath (c, r) {
  context.save()
  context.beginPath()
  context.strokeStyle = '#AAAAAA'
  context.fillStyle = '#333333'
  context.fillRect(c * stepSize, r * stepSize, stepSize, stepSize)
  context.stroke()
  context.restore()
}

function chooseDirection () {
  const index = Math.floor(Math.random() * 8)
  return directions[index]
}

function changeDirection () {
  const index = Math.floor(Math.random() * 13)
  return index < 2
}

function drawSteps () {
  for (let i = 0; i < maxSteps; i++) {
    if (changeDirection()) {
      direction = chooseDirection()
    }
    const nextLoc = { x: nextPos()[0] + startX, y: nextPos()[1] + startY }
    if (path.find(v => v.x === nextLoc.x && v.y === nextLoc.y)) {
      console.log('Backtrack!')
    } else {
      switchDirection()
      drawPath(startX, startY)
      path.push({ x: startX, y: startY })
    }
  }
}

function switchDirection () {
  switch (direction) {
    case (0):
      startX++
      return 
    case (45):
      startX++
      startY++
      return
    case (90):
      startY++
      return
    case (135):
      startX--
      startY++
      return
    case (180):
      startY--
      return 
    case (225):
      startX--
      startY--
      return
    case (270):
      startX--
      return 
    case (315):
      startX++
      startY--
      
  }
}

function nextPos () {
  switch (direction) {
    case (0):
      return [1, 0]
    case (45):
      return [1, 1]
    case (90):
      return [0, 1]
    case (135):
      return [-1, 1]
    case (180):
      return [0, -1]
    case (225):
      return [-1, -1]
    case (270):
      return [-1, 0]
    case (315):
      return [1, -1]
  }
}

function drawLevel () {
  context.canvas.width = 50 * stepSize * scale
  context.canvas.height = 50 * stepSize * scale
  context.scale(scale, scale)
  context.clearRect(0, 0, canvas.width / scale, canvas.height / scale)
  for (let r = 0; r < 50; r++) {
    for (let c = 0; c < 50; c++) {
      drawSquare(c, r)
    }
  }
}

function setupCanvas () {
  canvas = document.getElementById('canvas')
  context = canvas.getContext('2d')
  context.scale(scale, scale)
}

function init () {
  setupCanvas()
  drawLevel()
  drawSteps()
  console.log(path)
}
