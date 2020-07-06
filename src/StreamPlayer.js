import React from 'react'
import Hls from 'hls.js'
import Alert from 'react-bootstrap/Alert'
import { withRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './StreamPlayer.css'

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
    fetch(`https://api.edustream.live/request/?sid=fda734d93365f6ac6ced0f3d0c85aad460e1a8fc317c998c15546f6ab3d56f73&session=${this.state.session}`).then(data => data.json()).then(output => {
      if (!output.status) {
        this.state.errors.push({ title: "Bad Session Request!", message: "Failure while fetching to request session!" })
        this.setState({})

      } else {
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
    })
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
        <div id="col1">
          <video controls></video>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis dignissim non tellus vitae aliquam. Quisque ultricies erat et eros dictum, eu consectetur felis interdum. Ut sit amet magna et neque ullamcorper scelerisque et ac neque. Donec ac sagittis mauris. Suspendisse id blandit urna. Mauris non magna tempor, porta urna ut, malesuada ligula. Suspendisse ligula mi, luctus at commodo vitae, egestas sed dolor. Duis laoreet ex ante, id faucibus purus pharetra ut. Praesent sagittis facilisis nisi, quis suscipit odio consectetur et. Donec tristique hendrerit justo, ut vulputate risus rutrum sed. Praesent ac est sed metus vehicula imperdiet. Ut dictum ullamcorper ex, vel convallis ligula tincidunt id. Pellentesque ultricies ligula non risus congue, id gravida enim hendrerit. Duis sapien sapien, fermentum sed enim a, blandit consequat lorem. Phasellus ac lectus varius, placerat massa ut, elementum metus. In hac habitasse platea dictumst.

          Nunc quis luctus justo. Ut ac odio vitae leo sagittis interdum. Aliquam luctus bibendum fringilla. Vivamus id lectus erat. Donec ac rhoncus metus. Maecenas luctus pellentesque leo, et lacinia tellus sagittis id. In est neque, lacinia ac tortor id, vehicula ultricies est. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Vivamus quis eros dictum, suscipit lectus non, efficitur sem. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Duis arcu enim, laoreet et felis et, aliquam rutrum dolor. Maecenas posuere rhoncus auctor.

          Ut rhoncus pretium nunc, nec pretium tortor condimentum tempor. Donec quis purus metus. Fusce ex est, sollicitudin vitae mi sit amet, molestie egestas ligula. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nam fringilla lorem massa, in faucibus magna imperdiet quis. Nullam rhoncus, quam tempor scelerisque dictum, ligula leo laoreet turpis, ac lacinia justo odio vel urna. Cras varius hendrerit gravida. Praesent erat ipsum, convallis vitae gravida at, dictum ac augue.

Nam varius ullamcorper viverra. Sed rhoncus ante eu massa rhoncus, vitae malesuada leo imperdiet. Suspendisse egestas dapibus lacus, et posuere nisl finibus sit amet. Curabitur a semper turpis, sed consequat justo. Nunc non pellentesque metus, quis ornare dolor. Proin sit amet ipsum imperdiet, fermentum sapien vitae, sollicitudin felis. Nunc vitae laoreet massa, eu luctus lectus. Aenean ullamcorper dolor ut libero vehicula mattis ut sit amet ante. Cras sed ligula at urna congue volutpat at vel sapien. Vestibulum elementum ornare elit, non molestie risus suscipit vel. Curabitur vestibulum turpis nec arcu ornare eleifend. Nulla hendrerit felis ac eleifend ornare. Nunc condimentum vel ante a rutrum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</p>
        </div>
        <div id="col2">
          <h1>Shoutouts</h1>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis dignissim non tellus vitae aliquam. Quisque ultricies erat et eros dictum, eu consectetur felis interdum. Ut sit amet magna et neque ullamcorper scelerisque et ac neque. Donec ac sagittis mauris. Suspendisse id blandit urna. Mauris non magna tempor, porta urna ut, malesuada ligula. Suspendisse ligula mi, luctus at commodo vitae, egestas sed dolor. Duis laoreet ex ante, id faucibus purus pharetra ut. Praesent sagittis facilisis nisi, quis suscipit odio consectetur et. Donec tristique hendrerit justo, ut vulputate risus rutrum sed. Praesent ac est sed metus vehicula imperdiet. Ut dictum ullamcorper ex, vel convallis ligula tincidunt id. Pellentesque ultricies ligula non risus congue, id gravida enim hendrerit. Duis sapien sapien, fermentum sed enim a, blandit consequat lorem. Phasellus ac lectus varius, placerat massa ut, elementum metus. In hac habitasse platea dictumst.

          Nunc quis luctus justo. Ut ac odio vitae leo sagittis interdum. Aliquam luctus bibendum fringilla. Vivamus id lectus erat. Donec ac rhoncus metus. Maecenas luctus pellentesque leo, et lacinia tellus sagittis id. In est neque, lacinia ac tortor id, vehicula ultricies est. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Vivamus quis eros dictum, suscipit lectus non, efficitur sem. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Duis arcu enim, laoreet et felis et, aliquam rutrum dolor. Maecenas posuere rhoncus auctor.

          Ut rhoncus pretium nunc, nec pretium tortor condimentum tempor. Donec quis purus metus. Fusce ex est, sollicitudin vitae mi sit amet, molestie egestas ligula. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nam fringilla lorem massa, in faucibus magna imperdiet quis. Nullam rhoncus, quam tempor scelerisque dictum, ligula leo laoreet turpis, ac lacinia justo odio vel urna. Cras varius hendrerit gravida. Praesent erat ipsum, convallis vitae gravida at, dictum ac augue.

Nam varius ullamcorper viverra. Sed rhoncus ante eu massa rhoncus, vitae malesuada leo imperdiet. Suspendisse egestas dapibus lacus, et posuere nisl finibus sit amet. Curabitur a semper turpis, sed consequat justo. Nunc non pellentesque metus, quis ornare dolor. Proin sit amet ipsum imperdiet, fermentum sapien vitae, sollicitudin felis. Nunc vitae laoreet massa, eu luctus lectus. Aenean ullamcorper dolor ut libero vehicula mattis ut sit amet ante. Cras sed ligula at urna congue volutpat at vel sapien. Vestibulum elementum ornare elit, non molestie risus suscipit vel. Curabitur vestibulum turpis nec arcu ornare eleifend. Nulla hendrerit felis ac eleifend ornare. Nunc condimentum vel ante a rutrum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</p>
        </div>
      </div>
    )
  }
}

export default withRouter(StreamPlayer)
