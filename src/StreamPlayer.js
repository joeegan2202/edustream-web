import React from 'react'
import Hls from 'hls.js'
import Alert from 'react-bootstrap/Alert'
import 'bootstrap/dist/css/bootstrap.min.css'

class StreamPlayer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      session: 'f864a3bd5a4b48394ba49636f93f19a23fdb35da38ad66bd490f0c9e79a58db2',
      source: 'http://18.222.231.117:8080/stream/f864a3bd5a4b48394ba49636f93f19a23fdb35da38ad66bd490f0c9e79a58db2/stream.m3u8',
      errors: []
    }
  }

  componentDidMount() {
    fetch(`http://18.222.231.117:8080/request/?sid=fda734d93365f6ac6ced0f3d0c85aad460e1a8fc317c998c15546f6ab3d56f73&session=${this.state.session}`).then(data => data.json()).then(output => {
      if (!output.status) {
        this.state.errors.push({ title: "Bad Session Request!", message: "Failure while fetching to request session!" })
        this.setState({})
      }
    })
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
        {this.state.errors.map((error, id) => (
          <Alert key={id} variant="warning">
            <Alert.Heading>{error.title}</Alert.Heading>
            {error.message}
          </Alert>
        ))}
        <video></video>
      </div>
    )
  }
}

export default StreamPlayer
