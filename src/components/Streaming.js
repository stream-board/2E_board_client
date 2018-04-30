export default {
  name: 'Streaming',
  data: () => ({
    videos: [],
    mic: true,
    cam: true,
    webrtc: {}
  }),
  mounted: function () {
    // eslint-disable-next-line
    let webrtc = new SimpleWebRTC({
      localVideoEl: 'localVideo',
      remoteVideosEl: '',
      autoRequestMedia: true,
      url: 'http://ec2-34-228-226-216.compute-1.amazonaws.com:8888/'
    })

    this.$bus.on('user-disconnected', () => {
      webrtc.stopLocalVideo()
      webrtc.leaveRoom()
    })

    webrtc.on('readyToCall', function () {
      // you can name it anything
      webrtc.joinRoom(`room-${this.$route.params.roomid}`)
    })

    webrtc.on('videoAdded', (video, peer) => {
      console.log(peer)
      this.videos.push(webrtc.getDomId(peer))
      window.setTimeout(() => {
        var container = document.getElementById(webrtc.getDomId(peer))
        var overlay = document.createElement('div')
        overlay.id = `overlay-${peer.id}`
        overlay.classList.add(['overlay'])
        overlay.innerHTML = `<i aria-hidden="true" class="icon material-icons mute-icon">mic</i>`
        container.appendChild(video)
        container.appendChild(overlay)
        // suppress contextmenu
        video.oncontextmenu = function () { return false }
        video.onclick = function () {
          let overlay = document.getElementById(`overlay-${peer.id}`)
          if (video.volume === 0) {
            video.volume = 1
            overlay.innerHTML = `<i aria-hidden="true" class="icon material-icons mute-icon">mic</i>`
            overlay.classList.remove(['overlay-muted'])
          } else {
            video.volume = 0
            overlay.innerHTML = `<i aria-hidden="true" class="icon material-icons unmute-icon">mic_off</i>`
            overlay.classList.add(['overlay-muted'])
          }
        }
        video.onmouseenter = function () {
          let overlay = document.getElementById(`overlay-${peer.id}`)
          overlay.classList.add(['overlay-active'])
        }
        video.onmouseleave = function () {
          let overlay = document.getElementById(`overlay-${peer.id}`)
          overlay.classList.remove(['overlay-active'])
        }
      }, 100)
    })

    this.webrtc = webrtc
  },
  methods: {
    muteMic () {
      this.mic = false
      this.webrtc.mute()
      this.$bus.emit('mute-mic')
    },
    unmuteMic () {
      this.mic = true
      this.webrtc.unmute()
      this.$bus.emit('unmute-mic')
    },
    useCam () {
      this.cam = true
      this.webrtc.resumeVideo()
      this.$bus.emit('activate-cam')
    },
    blockCam () {
      this.cam = false
      this.webrtc.pauseVideo()
      this.$bus.emit('block-cam')
    },
    muteUser (id) {
      console.log(id)
    }
  }
}
