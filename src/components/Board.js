export default {
  name: 'Board',
  data: () => ({
    socket: null,
    isAllowed: false,
    selectedColor: '#f44336',
    selectedThickness: 8,
    selectedType: 'point'
  }),
  mounted: function () {
    let user = JSON.parse(localStorage.getItem('user'))
    let URL = `35.196.37.210?room=${this.$route.params.roomid}&nick=${user.nickname}&id=${user.id}`
    // eslint-disable-next-line
    this.socket = io(URL)
    componentLoaded(this.$route.params.roomid, this)
    window.setTimeout(() => this.updateCursor(), 50)
  },
  methods: {
    askForTurn () {
      this.socket.emit('askForBoard')
    },
    takeBackPencil () {
      this.socket.emit('resetBoard')
    },
    updateCursor () {
      switch (this.selectedType) {
        case 'point':
          $('#board').awesomeCursor('circle', {
            color: this.selectedColor,
            size: this.selectedThickness,
            hotspot: 'center'
          })
          break
        case 'line':
          $('#board').awesomeCursor('circle', {
            color: this.selectedColor,
            size: this.selectedThickness,
            hotspot: 'center'
          })
          break
        case 'eraser':
          $('#board').awesomeCursor('circle-thin', {
            color: '#000000',
            size: this.selectedThickness,
            hotspot: 'center'
          })
          break
      }
    },
    setAdmin () {
      console.log('emitadmin')
      this.$bus.emit('set-admin')
    },
    changePermissions (value) {
      this.$bus.emit('change-permissions', value)
    },
    clearBoard () {
      this.socket.emit('clear')
    }
  }
}

function componentLoaded (roomId, _this) {
  var $swal = _this.$swal
  var socket = _this.socket
  var $bus = _this.$bus

  var isPenDown = false
  var snapshot

  var canvas
  var context

  var canvasContainer = document.getElementById('canvas-container')

  var hasTouch = false

  var localPen = {}

  init()

  function init () {
    registerSocketListeners()
    registerBusListeners()
    initCanvas()
    registerInputListeners()
  }

  function initCanvas () {
    canvas = document.getElementById('board')

    canvas.width = 1280
    canvas.height = 720

    context = canvas.getContext('2d')
    context.lineCap = 'round'
  }

  function registerInputListeners () {
    canvas.onmousedown = pointerDownListener
    document.onmousemove = pointerMoveListener
    document.onmouseup = pointerUpListener
    document.ontouchstart = touchDownListener
    document.ontouchmove = touchMoveListener
    document.ontouchend = touchUpListener
  }

  function registerBusListeners () {
    $bus.on('ask-for-turn', _this.askForTurn)
    $bus.on('take-back-pencil', _this.takeBackPencil)
    $bus.on('change-color', (data) => {
      _this.selectedColor = data
      _this.updateCursor()
    })
    $bus.on('change-thickness', (data) => {
      _this.selectedThickness = data.value
      _this.updateCursor()
    })
    $bus.on('change-type', (data) => {
      _this.selectedType = data
      _this.updateCursor()
    })
    $bus.on('clear-board', () => {
      _this.clearBoard()
    })
    $bus.on('user-disconnected', () => {
      socket.disconnect()
    })
  }

  function registerSocketListeners () {
    socket.on('newDrawer', (data) => {
      $bus.emit('new-drawer', data)
    })
    socket.on('userDisconnected', (data) => {
      $bus.emit('user-disconnected', data)
    })
    socket.on('admin', function () {
      _this.isAllowed = true
      _this.setAdmin()
      _this.changePermissions(true)
    })
    socket.on('draw', function (data) {
      drawMessageListener(data)
    })
    socket.on('clear', function () {
      clearBoard()
    })
    socket.on('askForBoard', function (data) {
      $swal({
        title: 'Turn petition',
        text: `User ${data.nick} wants to use the board`,
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#26d3cd',
        cancelButtonColor: '#f44336',
        confirmButtonText: 'Yes, approve',
        cancelButtonText: 'No, disapprove'
      }).then((result) => {
        if (result.value) {
          $swal({
            title: 'Approved',
            text: 'User has the permission',
            type: 'success',
            confirmButtonColor: '#26d3cd'
          })
          _this.isAllowed = false
          _this.changePermissions(false)
          socket.emit('answerForBoard', {answer: true, socketId: data.socketId})
        } else {
          $swal({
            title: 'Disapproved',
            text: 'You disapproved the user',
            type: 'error',
            confirmButtonColor: '#26d3cd'
          })
          socket.emit('answerForBoard', {answer: false, socketId: data.socketId})
        }
      })
    })
    socket.on('answerForBoard', function (data) {
      if (data) {
        $swal({
          title: 'Permission granted',
          text: 'You can draw on the board',
          type: 'success',
          confirmButtonColor: '#26d3cd'
        })
        _this.changePermissions(true)
        _this.isAllowed = true
      } else {
        $swal({
          title: 'Permission denied',
          text: 'You can\'t draw on the board',
          type: 'error',
          confirmButtonColor: '#26d3cd'
        })
        _this.changePermissions(false)
        _this.isAllowed = false
      }
    })
    socket.on('resetBoard', function (data) {
      _this.changePermissions(true)
      _this.isAllowed = true
      $swal({
        title: 'You took the pen back',
        text: 'You can start drawing again',
        type: 'success',
        confirmButtonColor: '#26d3cd'
      })
    })
    socket.on('lostPermission', function () {
      _this.changePermissions(false)
      _this.isAllowed = false
      $swal({
        title: 'You lost permission',
        text: 'You can no longer draw',
        type: 'error',
        confirmButtonColor: '#26d3cd'
      })
    })
    socket.on('hostLeft', function () {
      $swal({
        title: 'Call finished',
        text: 'The host has left the room, you got disconnected from the room',
        type: 'info',
        confirmButtonColor: '#26d3cd',
        confirmButtonText: 'Return to lobby'
      }).then((result) => {
        _this.$router.push('/app')
      })
    })

    _this.$bus.on('clear-board', () => {
      clearBoard()
    })
  }

  function getType () {
    return _this.selectedType
  }

  function takeSnapshot () {
    snapshot = context.getImageData(0, 0, canvas.width, canvas.height)
  }

  function restoreSnapshot () {
    context.putImageData(snapshot, 0, 0)
  }

  function clearBoard () {
    context.fillStyle = '#FFFFFF'
    context.fillRect(0, 0, canvas.width, canvas.height)
  }

  function drawMessageListener (data) {
    switch (data.type) {
      case 'path':
        console.log(data.color)
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
    socket.emit('draw', { type: 'path', event: event, coords: coords, color: _this.selectedColor, thickness: _this.selectedThickness })
  }

  function broadcastLine (coords) {
    socket.emit('draw', { type: 'line', color: _this.selectedColor, thickness: _this.selectedThickness, coords: coords })
  }

  function broadcastErase (event, coords) {
    socket.emit('draw', { type: 'path', event: event, coords: coords, color: '#FFFFFF', thickness: _this.selectedThickness })
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

    var mouseX = (event.clientX * canvas.width) / canvas.clientWidth - canvasContainer.offsetLeft
    var mouseY = (event.clientY * canvas.height) / canvas.clientHeight - canvasContainer.offsetTop

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
    var mouseX = (event.clientX * canvas.width) / canvas.clientWidth - canvasContainer.offsetLeft
    var mouseY = (event.clientY * canvas.height) / canvas.clientHeight - canvasContainer.offsetTop

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
    var mouseX = (event.clientX * canvas.width) / canvas.clientWidth - canvasContainer.offsetLeft
    var mouseY = (event.clientY * canvas.height) / canvas.clientHeight - canvasContainer.offsetTop

    penUp(mouseX, mouseY)
  }

  function penDown (x, y) {
    if (_this.isAllowed) {
      isPenDown = true
      localPen.x = x
      localPen.y = y

      switch (getType()) {
        case 'point':
          drawPath(_this.selectedColor, _this.selectedThickness, 'start', x, y)
          broadcastPath('start', localPen)
          break
        case 'line':
          takeSnapshot()
          break
        case 'eraser':
          drawPath('#FFFFFF', _this.selectedThickness, 'start', x, y)
          broadcastErase('start', localPen)
          break
      }
    }
  }

  function penMove (x, y) {
    if (isPenDown && _this.isAllowed) {
      switch (getType()) {
        case 'point':
          drawPath(_this.selectedColor, _this.selectedThickness, 'move', x, y)
          broadcastPath('move', { x: x, y: y })
          break
        case 'line':
          restoreSnapshot()
          drawLine(_this.selectedColor, _this.selectedThickness, localPen.x, localPen.y, x, y)
          break
        case 'eraser':
          drawPath('#FFFFFF', _this.selectedThickness, 'move', x, y)
          broadcastErase('move', { x: x, y: y })
          break
      }
    }
  }

  function penUp (x, y) {
    if (isPenDown && _this.isAllowed) {
      switch (getType()) {
        case 'point':
          drawPath(_this.selectedColor, _this.selectedThickness, 'end', x, y)
          broadcastPath('end', { x: x, y: y })
          break
        case 'line':
          restoreSnapshot()
          drawLine(_this.selectedColor, _this.selectedThickness, localPen.x, localPen.y, x, y)
          broadcastLine({ start: { x: localPen.x, y: localPen.y }, end: { x: x, y: y } })
          break
        case 'eraser':
          drawPath('#FFFFFF', _this.selectedThickness, 'end', x, y)
          broadcastErase('end', { x: x, y: y })
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
