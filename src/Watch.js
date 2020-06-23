import React from 'react'
import StreamPlayer from './StreamPlayer'

class Watch extends React.Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  render() {
    return (
      <div className="Watch">
        <StreamPlayer></StreamPlayer>
      </div>
    )
  }
}

export default Watch
