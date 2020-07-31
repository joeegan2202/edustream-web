import React from 'react'
import { withRouter } from 'react-router-dom'
import StreamPlayer from './StreamPlayer'
import './Watch.css'
import ListGroup from 'react-bootstrap/ListGroup'
import ListGroupItem from 'react-bootstrap/ListGroupItem'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import { API_URL } from './Variables'

class Watch extends React.Component {
  constructor(props) {
    super(props)

    let session = window.sessionStorage.getItem('session')
    let sid = window.localStorage.getItem('sid')

    if (!session) {
      this.props.history.push('/auth')
    }

    let interval = null

    let params = new URLSearchParams(this.props.location.search)

    switch(params.get('role')) {
    case 'admin':
      fetch(`https://${API_URL}/info/?sid=${window.localStorage.getItem('sid')}&session=${window.sessionStorage.getItem('session')}&room=${params.get('room')}`).then(data => data.json()).then(output => {
        if(!output.status) {
          this.props.history.push('/auth')
          return
        }
        this.setState({ name: `Administrator`, cname: output.info.cname, period: output.info.period, attendance: output.info.attendance })
      })
      interval = setInterval(() => fetch(`https://${API_URL}/info/?sid=${window.localStorage.getItem('sid')}&session=${window.sessionStorage.getItem('session')}&room=${params.get('room')}`).then(data => data.json()).then(output => {
        if(!output.status) {
          this.props.history.push('/auth')
          return
        }
        this.setState({ name: `Administrator`, cname: output.info.cname, period: output.info.period, attendance: output.info.attendance })
      }), 15000)
      break
    case 'teacher':
      fetch(`https://${API_URL}/info/?sid=${window.localStorage.getItem('sid')}&session=${window.sessionStorage.getItem('session')}`).then(data => data.json()).then(output => {
        if(!output.status) {
          this.props.history.push('/auth')
          return
        }
        this.setState({ name: `${output.info.fname} ${output.info.lname}`, cname: output.info.cname, period: output.info.period, attendance: output.info.attendance })
      })
      interval = setInterval(() => fetch(`https://${API_URL}/info/?sid=${window.localStorage.getItem('sid')}&session=${window.sessionStorage.getItem('session')}`).then(data => data.json()).then(output => {
        if(!output.status) {
          this.props.history.push('/auth')
          return
        }
        this.setState({ name: `${output.info.fname} ${output.info.lname}`, cname: output.info.cname, period: output.info.period, attendance: output.info.attendance })
      }), 15000)
      break
    case 'student':
      fetch(`https://${API_URL}/info/?sid=${window.localStorage.getItem('sid')}&session=${window.sessionStorage.getItem('session')}`).then(data => data.json()).then(output => {
        if(!output.status) {
          this.props.history.push('/auth')
          return
        }
        this.setState({ name: `${output.info.fname} ${output.info.lname}`, cname: output.info.cname, period: output.info.period })
      })
      interval = setInterval(() => fetch(`https://${API_URL}/info/?sid=${window.localStorage.getItem('sid')}&session=${window.sessionStorage.getItem('session')}`).then(data => data.json()).then(output => {
        if(!output.status) {
          this.props.history.push('/auth')
          return
        }
        this.setState({ name: `${output.info.fname} ${output.info.lname}`, cname: output.info.cname, period: output.info.period })
      }), 15000)
      break
    }

    this.state = {
      interval,
      attendance: [],
      name: '',
      cname: '',
      period: '',
      activeShouts: [],
      role: params.get('role'),
      streamPath: params.get("role") == 'admin' ? `${sid}/${session}/${params.get("room")}` : `${sid}/${session}`
    }
  }

  shoutCallback(shouts) {
    this.setState({ activeShouts: this.state.activeShouts.concat(shouts) })
  }

  componentWillUnmount() {
    clearInterval(this.state.interval)
    document.title = 'EduStream'
  }

  render() {
    document.title = this.state.cname

    return (
      <div className="Watch">
          {this.state.activeShouts.length ? (() => {
            //setTimeout(() => {this.setState({ activeShouts: this.state.activeShouts.slice(1) })}, 5000)
            return (
            <div id="shout-shadow">
              <Alert variant="primary" onClose={() => {this.setState({ activeShouts: this.state.activeShouts.slice(1) })}} dismissible>
                <Alert.Heading>{this.state.activeShouts[0].body.name} <i>{this.state.activeShouts[0].body.time}</i></Alert.Heading>
                <p>{this.state.activeShouts[0].body.text}</p>
                <hr/>
                <Button variant="danger" onClick={() => this.setState({ activeShouts: [] })}>Close All</Button>
              </Alert>
            </div>
            )})() : null}
        <div id="col1">
          <StreamPlayer streamPath={this.state.streamPath}></StreamPlayer>
          <div id="stream-info">
            <h1>Welcome, {this.state.name}!</h1>
            <p>Class: {this.state.cname}<br/>Period: {this.state.period}</p>
            {this.state.role != "student" ? <ListGroup><b>Attendance ({this.state.attendance.length == 1 ? '1 person in room' : `${this.state.attendance.length} people in room`}):</b>
              {this.state.attendance.map((name, index) => {
              return (
                <ListGroupItem key={index}>{name}</ListGroupItem>
              )})}
            </ListGroup> : null}
          </div>
        </div>
        <div id="col2">
          <this.ShoutOuts shoutCallback={this.shoutCallback.bind(this)} name={this.state.name}></this.ShoutOuts>
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
    fetch(`https://${API_URL}/shout/poll/?sid=${window.localStorage.getItem('sid')}&session=${window.sessionStorage.getItem('session')}&lastID=${id}`).then(data => data.json()).then(output => {
      if(!output.status) {
        this.props.history.push('/auth')
        return
      }
      this.props.shoutCallback(output.shouts)
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
        <div id="shout-header">
          <h1>Shout It Out!</h1>
          <h4>Ask a question here:</h4>
        </div>
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

          fetch(`https://${API_URL}/shout/post/?sid=${window.localStorage.getItem('sid')}&session=${window.sessionStorage.getItem('session')}`, {
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

Watch.prototype.ShoutOuts = withRouter(ShoutOuts)

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
