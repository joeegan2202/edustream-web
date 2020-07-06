import React from 'react'
import { withRouter } from 'react-router-dom'
import StreamPlayer from './StreamPlayer'

class Watch extends React.Component {
  constructor(props) {
    super(props)

    let session = window.sessionStorage.getItem('session')

    if (!session) {
      history.push('/auth')
    }

    let params = new URLSearchParams(this.props.location.search)

    this.state = {
      streamPath: params.get("role") == 'admin' ? `${session}/${params.get("room")}` : session
    }
  }

  render() {
    return (
      <div className="Watch">
        <StreamPlayer streamPath={this.state.streamPath}></StreamPlayer>
      </div>
    )
  }
}

export default withRouter(Watch)
