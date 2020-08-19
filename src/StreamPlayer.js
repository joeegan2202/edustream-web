import React from 'react'
import Hls from 'hls.js'
import Alert from 'react-bootstrap/Alert'
import { withRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import { API_URL } from './Variables'

class StreamPlayer extends React.Component {
  constructor(props) {
    super(props)

    let session = window.sessionStorage.getItem('session')

    this.state = {
      session,
      source: `https://${API_URL}/stream/${this.props.streamPath}/stream.m3u8`,
      errors: []
    }
  }

  startStream() {
    var video = document.querySelector('video');
    if (Hls.isSupported()) {
      let hls = new Hls();
      hls.loadSource(this.state.source);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        video.play()
      });
      hls.on(Hls.Events.ERROR, (event, data) => {
        if(data.fatal) {
          setTimeout(this.startStream.bind(this), 1000)
        }
      });

      this.setState({ hls })
    }

    else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = this.state.source;
      video.addEventListener('loadedmetadata', function () {
        video.play();
      });
    }
  }

  componentDidMount() {
    this.startStream()
  }

  componentWillUnmount() {
    if (this.state.hls) {
      this.state.hls.destroy()
    }
    document.querySelector('video').src=null
  }

  render() {
    return (
      <div className="StreamPlayer">
        {this.state.errors.map((error, id) => (
          <Alert key={id} variant="warning">
            <Alert.Heading>{error.title}</Alert.Heading>
            {error.message}
          </Alert>
        ))}
        {this.props.role === 'teacher' ? 
        <video controls mute poster="banner.png"></video> :
        <video controls poster="/banner.png"></video>}
      </div>
    )
  }
}

export default withRouter(StreamPlayer)
