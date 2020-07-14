import React from 'react'
import Hls from 'hls.js'
import Alert from 'react-bootstrap/Alert'
import { withRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

class StreamPlayer extends React.Component {
  constructor(props) {
    super(props)

    let session = window.sessionStorage.getItem('session')

    console.log(this.props)

    this.state = {
      session,
      source: `https://api.edustream.live/stream/${this.props.streamPath}/stream.m3u8`,
      errors: []
    }
  }

  componentDidMount() {
    var video = document.querySelector('video');
    if (Hls.isSupported()) {
      let hls = new Hls();
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

      this.setState({ hls })
    }

    else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = this.state.source;
      video.addEventListener('loadedmetadata', function () {
        video.play();
      });
    }
  }

  componentWillUnmount() {
    if (this.state.hls) {
      this.state.hls.destroy()
    }
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
        <video controls></video>
      </div>
    )
  }
}

export default withRouter(StreamPlayer)
