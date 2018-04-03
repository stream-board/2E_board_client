export default {
  name: 'Board',
  mounted: function () {
    componentLoaded(this.$route.params.roomid, this.$swal, this.$router)
  }
}

function componentLoaded (roomId, swal, router) {
  let user = JSON.parse(localStorage.getItem('user'))
  const URL = `192.168.99.100:4002?room=${roomId}&nick=${user.nickname}&id=${user.id}`
  var $swal = swal
  var $router = router
  // eslint-disable-next-line
  const socket = io(URL)

  var isAllowed = false

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

  init()

  function init () {
    registerSocketListeners()
    initCanvas()
    initInput()
    registerInputListeners()
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
    document.getElementById('ask-button').onclick = askForTurn
    document.getElementById('reset-button').onclick = resetPermissions
  }

  function registerSocketListeners () {
    socket.on('admin', function () {
      document.getElementById('actions').hidden = true
      isAllowed = true
    })
    socket.on('draw', function (data) {
      drawMessageListener(data)
    })
    socket.on('askForBoard', function (data) {
      $swal({
        title: 'Turn petition',
        text: `User ${data.nick} wants to use the board`,
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, approve',
        cancelButtonText: 'No, disapprove'
      }).then((result) => {
        if (result.value) {
          $swal(
            'Approved',
            'User has the permission',
            'success'
          )
          isAllowed = false
          socket.emit('answerForBoard', {answer: true, socketId: data.socketId})
          document.getElementById('admin-actions').hidden = false
        } else {
          $swal(
            'Disapproved',
            'You disapproved the user',
            'error'
          )
          socket.emit('answerForBoard', {answer: false, socketId: data.socketId})
        }
      })
    })
    socket.on('answerForBoard', function (data) {
      if (data) {
        $swal({
          title: 'Permission granted',
          text: 'You can draw on the board',
          type: 'success'
        })
        isAllowed = true
        document.getElementById('actions').hidden = true
      } else {
        $swal({
          title: 'Permission denied',
          text: 'You can\'t draw on the board',
          type: 'error'
        })
        isAllowed = false
      }
    })
    socket.on('resetBoard', function (data) {
      isAllowed = true
      $swal(
        'You took the pen back',
        'You can start drawing again',
        'success'
      )
      document.getElementById('admin-actions').hidden = true
    })
    socket.on('lostPermission', function () {
      isAllowed = false
      $swal(
        'You lost permission',
        'You can no longer draw',
        'error'
      )
      document.getElementById('actions').hidden = false
    })
    socket.on('hostLeft', function () {
      $swal({
        title: 'Call finished',
        text: 'The host has left the room, you got disconnected of the room',
        type: 'info',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Return to lobby'
      }).then((result) => {
        $router.push({path: '/'})
      })
    })
  }

  function getType () {
    return document.querySelector('.typeCheckbox:checked').value
  }

  function askForTurn () {
    socket.emit('askForBoard')
  }

  function resetPermissions () {
    socket.emit('resetBoard')
  }

  function takeSnapshot () {
    snapshot = context.getImageData(0, 0, canvas.width, canvas.height)
  }

  function restoreSnapshot () {
    context.putImageData(snapshot, 0, 0)
  }

  function drawMessageListener (data) {
    switch (data.type) {
      case 'path':
        drawPath(data.color, data.thickness, data.event, data.coords.x, data.coords.y)
        break
      case 'line':
        drawLine(data.color, data.thickness,
          data.coords.start.x, data.coords.start.y,
          data.coords.end.x, data.coords.end.y)
        break
    }
  }

  function broadcastPath (event, coords) {
    socket.emit('draw', { type: 'path', event: event, coords: coords, color: localLineColor, thickness: localLineThickness })
  }

  function broadcastLine (coords) {
    socket.emit('draw', { type: 'line', color: localLineColor, thickness: localLineThickness, coords: coords })
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

    var mouseX = (event.clientX * canvas.width) / canvas.clientWidth
    var mouseY = (event.clientY * canvas.height) / canvas.clientHeight
    console.log(canvas)

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
    var mouseX = (event.clientX * canvas.width) / canvas.clientWidth
    var mouseY = (event.clientY * canvas.height) / canvas.clientHeight

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
    var mouseX = (event.clientX * canvas.width) / canvas.clientWidth
    var mouseY = (event.clientY * canvas.height) / canvas.clientHeight

    penUp(mouseX, mouseY)
  }

  function penDown (x, y) {
    if (isAllowed) {
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
  }

  function penMove (x, y) {
    if (isPenDown && isAllowed) {
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
    if (isPenDown && isAllowed) {
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
