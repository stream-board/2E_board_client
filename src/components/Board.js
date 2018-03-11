export default {
  name: 'Board',
  mounted: function () {
    componentLoaded(this.$route.params.roomid)
  }
}

function componentLoaded (roomId) {
  const socket = io('localhost:3000')

  var isPenDown = false

  var snapshot

  var defaultLineColor = '#000000'
  var defaultLineThickness = 3

  var localLineColor = defaultLineColor
  var localLineThickness = defaultLineThickness

  var canvas
  var context

  var hasTouch = false

  var localPen = {}

  window.onload = init

  function init () {
    socket.emit('join', {room: roomId})
    initCanvas()
    initInput()
    registerInputListeners()
    registerSocketListeners()
  }

  function initCanvas () {
    canvas = document.getElementById('board')

    canvas.width = 1280
    canvas.height = 720

    context = canvas.getContext('2d')
    context.lineCap = 'round'
  }

  function initInput () {
    $('#colorpicker').spectrum({
      color: '#000',
      change: function (color) {
        let selectedColor = color.toHexString()
        localLineColor = selectedColor
      }
    })

    var thicknessSelect = document.getElementById('thick-select')
    thicknessSelect.value = defaultLineThickness

    thicknessSelect.addEventListener('change', function (evt) {
      localLineThickness = evt.target.value
    })
  }

  function registerInputListeners () {
    canvas.onmousedown = pointerDownListener
    document.onmousemove = pointerMoveListener
    document.onmouseup = pointerUpListener
    document.ontouchstart = touchDownListener
    document.ontouchmove = touchMoveListener
    document.ontouchend = touchUpListener
  }

  function registerSocketListeners () {
    socket.on('path', function (data) {
      pathMessageListener(data)
    })
    socket.on('line', function (data) {
      lineMessageListener(data)
    })
  }

  function getType () {
    return document.querySelector('.typeCheckbox:checked').value
  }

  function takeSnapshot () {
    snapshot = context.getImageData(0, 0, canvas.width, canvas.height)
  }

  function restoreSnapshot () {
    context.putImageData(snapshot, 0, 0)
  }

  function pathMessageListener (data) {
    drawPath(data.color, data.thickness, data.type, data.coords.x, data.coords.y)
  }

  function lineMessageListener (data) {
    drawLine(data.color, data.thickness,
      data.coords.start.x, data.coords.start.y,
      data.coords.end.x, data.coords.end.y)
  }

  function broadcastPath (type, coords) {
    socket.emit('path', { type: type, coords: coords, color: localLineColor, thickness: localLineThickness })
  }

  function broadcastLine (coords) {
    socket.emit('line', { color: localLineColor, thickness: localLineThickness, coords: coords })
  }

  function touchDownListener (e) {
    hasTouch = true
    if (event.target.nodeName !== 'SELECT') {
      e.preventDefault()
    }

    var touchX = e.changedTouches[0].clientX - canvas.offsetLeft
    var touchY = e.changedTouches[0].clientY - canvas.offsetTop
    if (!isPenDown) {
      penDown(touchX, touchY)
    }
  }

  function touchMoveListener (e) {
    hasTouch = true
    e.preventDefault()
    var touchX = e.changedTouches[0].clientX - canvas.offsetLeft
    var touchY = e.changedTouches[0].clientY - canvas.offsetTop
    penMove(touchX, touchY)
  }

  function touchUpListener (e) {
    hasTouch = true
    e.preventDefault()
    var touchX = e.changedTouches[0].clientX - canvas.offsetLeft
    var touchY = e.changedTouches[0].clientY - canvas.offsetTop
    penUp(touchX, touchY)
  }

  function pointerDownListener (e) {
    if (hasTouch) {
      return
    }

    var event = e || window.event

    var mouseX = event.clientX - canvas.offsetLeft
    var mouseY = event.clientY - canvas.offsetTop

    penDown(mouseX, mouseY)

    if (event.preventDefault) {
      if (event.target.nodeName !== 'SELECT') {
        event.preventDefault()
      }
    } else {
      return false
    }
  }

  function pointerMoveListener (e) {
    if (hasTouch) {
      return
    }
    var event = e || window.event
    var mouseX = event.clientX - canvas.offsetLeft
    var mouseY = event.clientY - canvas.offsetTop

    penMove(mouseX, mouseY)

    if (event.preventDefault) {
      event.preventDefault()
    } else {
      return false // IE
    }
  }

  function pointerUpListener (e) {
    if (hasTouch) {
      return
    }
    var event = e || window.event
    var mouseX = event.clientX - canvas.offsetLeft
    var mouseY = event.clientY - canvas.offsetTop

    penUp(mouseX, mouseY)
  }

  function penDown (x, y) {
    isPenDown = true
    localPen.x = x
    localPen.y = y

    switch (getType()) {
      case 'point':
        drawPath(localLineColor, localLineThickness, 'start', x, y)
        broadcastPath('start', localPen)
        break
      case 'line':
        takeSnapshot()
        break
    }
  }

  function penMove (x, y) {
    if (isPenDown) {
      switch (getType()) {
        case 'point':
          drawPath(localLineColor, localLineThickness, 'move', x, y)
          broadcastPath('move', { x: x, y: y })
          break
        case 'line':
          restoreSnapshot()
          drawLine(localLineColor, localLineThickness, localPen.x, localPen.y, x, y)
          break
      }
    }
  }

  function penUp (x, y) {
    if (isPenDown) {
      switch (getType()) {
        case 'point':
          drawPath(localLineColor, localLineThickness, 'end', x, y)
          broadcastPath('end', { x: x, y: y })
          break
        case 'line':
          restoreSnapshot()
          drawLine(localLineColor, localLineThickness, localPen.x, localPen.y, x, y)
          broadcastLine({ start: { x: localPen.x, y: localPen.y }, end: { x: x, y: y } })
          break
      }
    }
    isPenDown = false
  }

  function drawLine (color, thickness, x1, y1, x2, y2) {
    context.strokeStyle = color
    context.lineWidth = thickness

    context.beginPath()
    context.moveTo(x1, y1)
    context.lineTo(x2, y2)
    context.stroke()
    context.closePath()
  }

  function drawPath (color, thickness, type, x, y) {
    context.strokeStyle = color
    context.lineWidth = thickness
    switch (type) {
      case 'start':
        context.beginPath()
        context.moveTo(x, y)
        break
      case 'move':
        context.lineTo(x, y)
        context.stroke()
        break
      case 'end':
        context.closePath()
        break
    }
  }
}
