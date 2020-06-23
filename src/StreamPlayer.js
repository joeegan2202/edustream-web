import React from 'react'
import Hls from 'hls.js'

class StreamPlayer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      source: "http://freja.hiof.no:1935/rtplive/_definst_/hessdalen03.stream/playlist.m3u8"
    }
  }

  load() {
    var video = document.querySelector('video');
    if (Hls.isSupported()) {
      var hls = new Hls();
      console.log("HLS is supported")
      hls.loadSource(this.state.source);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        console.log("Attached!")
        video.play()
      });
      hls.on(Hls.Events.ERROR, function (event, data) {
        console.log(data)
      });
    }

    else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = this.state.source;
      video.addEventListener('loadedmetadata', function () {
        video.play();
      });
    }
  }

  render() {
    return (
      <div className="StreamPlayer">
        <video></video>
      </div>
    )
  }
}

export default StreamPlayer
