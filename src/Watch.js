import React from 'react'
import { withRouter } from 'react-router-dom'
import StreamPlayer from './StreamPlayer'
import './Watch.css'
import ListGroup from 'react-bootstrap/ListGroup'
import ListGroupItem from 'react-bootstrap/ListGroupItem'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'

class Watch extends React.Component {
  constructor(props) {
    super(props)

    let session = window.sessionStorage.getItem('session')
    let sid = window.localStorage.getItem('sid')

    if (!session) {
      history.push('/auth')
    }

    let params = new URLSearchParams(this.props.location.search)

    if (params.get('role') == 'admin') {
      fetch(`https://api.edustream.live/info/?sid=${window.localStorage.getItem('sid')}&session=${window.sessionStorage.getItem('session')}&room=${params.get('room')}`).then(data => data.json()).then(output => {
        this.setState({ name: `Administrator` })
      })
    } else {
      fetch(`https://api.edustream.live/info/?sid=${window.localStorage.getItem('sid')}&session=${window.sessionStorage.getItem('session')}`).then(data => data.json()).then(output => {
        this.setState({ name: `${output.info.fname} ${output.info.lname}` })
      })
    }

    this.state = {
      name: '',
      streamPath: params.get("role") == 'admin' ? `${sid}/${session}/${params.get("room")}` : `${sid}/${session}`
    }
  }

  render() {
    return (
      <div className="Watch">
        <div id="col1">
          <StreamPlayer streamPath={this.state.streamPath}></StreamPlayer>
        </div>
        <div id="col2">
          <ShoutOuts name={this.state.name}></ShoutOuts>
        </div>
      </div>
    )
  }
}

class ShoutOuts extends React.Component {
  constructor(props) {
    super(props)

    this.sentry = true
    this.state = {
      messages: []
    }
  }

  updateMessages() {
    let id = this.state.messages[this.state.messages.length - 1] ? this.state.messages[this.state.messages.length - 1].id : 0
    fetch(`https://api.edustream.live/shout/poll/?sid=${window.localStorage.getItem('sid')}&session=${window.sessionStorage.getItem('session')}&lastId=${id}`).then(data => data.json()).then(output => {
      this.setState({ messages: this.state.messages.concat(output.shouts) })
    }).finally(() => {
      if(this.sentry){
        this.updateMessages.call(this)
      }})
  }

  componentDidMount() {
    this.updateMessages()
  }

  componentWillUnmount() {
    this.sentry = false
  }

  render() {
    return (
      <div className="ShoutOuts">
        <h1>Shout It Out!</h1>
        <h4>Ask a question here</h4>
        <ListGroup>
          {this.state.messages.map((message, index) => {
            return (<ListGroupItem key={index}>
              <Message message={message}></Message>
            </ListGroupItem>)
          })}
        </ListGroup>
        <form onSubmit={e => {
          e.preventDefault()

          let message = JSON.stringify({ name: this.props.name, time: new Date().toLocaleTimeString(), text: document.querySelector("#text input").value })

          document.querySelector("#text input").value = ""

          fetch(`https://api.edustream.live/shout/post/?sid=${window.localStorage.getItem('sid')}&session=${window.sessionStorage.getItem('session')}`, {
            method: "POST",
            body: message
          }).then(data => data.json()).then(output => console.log(output))
        }}>
          <InputGroup id="text">
            <FormControl placeholder="Your message:" />
            <Button type="submit">Shout</Button>
          </InputGroup>
        </form>
      </div>
    )
  }
}

class Message extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <div className="Message">
        <i>Time: {this.props.message.body.time} </i>
        <b>Name: {this.props.message.body.name} </b>
        <p>{this.props.message.body.text}</p>
      </div>
    )
  }
}

export default withRouter(Watch)
