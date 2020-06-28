import React from 'react'
import Hls from 'hls.js'
import Alert from 'react-bootstrap/Alert'
import { withRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

class StreamPlayer extends React.Component {
    constructor(props) {
        super(props)

        let session = window.sessionStorage.getItem('session')

        if (!session) {
            history.push('/auth')
        }

        this.state = {
            session,
            source: `https://api.edustream.live/stream/${session}/stream.m3u8`,
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
                    hls.on(Hls.Events.MANIFEST_PARSED, function() {
                        console.log("Attached!")
                        video.play()
                    });
                    hls.on(Hls.Events.ERROR, function(event, data) {
                        console.log(data)
                    });

                    this.setState({ hls })
                }

                else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = this.state.source;
                    video.addEventListener('loadedmetadata', function() {
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
                <video></video>
            </div>
        )
    }
}

export default withRouter(StreamPlayer)
