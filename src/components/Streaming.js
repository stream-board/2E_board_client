export default {
  name: 'Streaming',
  data: () => ({
    videos: []
  }),
  mounted: function () {
    // eslint-disable-next-line
    var webrtc = new SimpleWebRTC({
      // the id/element dom element that will hold "our" video
      localVideoEl: 'localVideo',
      // the id/element dom element that will hold remote videos
      remoteVideosEl: '',
      // immediately ask for camera access
      autoRequestMedia: true,
      url: 'http://ec2-34-228-226-216.compute-1.amazonaws.com:8888/'
    })

    webrtc.on('readyToCall', function () {
      // you can name it anything
      webrtc.joinRoom('test')
    })

    webrtc.on('videoAdded', (video, peer) => {
      console.log('video added', peer)
      console.log(video)
      this.videos.push(webrtc.getDomId(peer))
      window.setTimeout(() => {
        var container = document.getElementById(webrtc.getDomId(peer))
        container.appendChild(video)
        // suppress contextmenu
        video.oncontextmenu = function () { return false }
      }, 100)
    })
  }
}
