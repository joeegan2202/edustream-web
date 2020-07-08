import React from 'react'
import { withRouter } from 'react-router-dom'
import ListGroup from 'react-bootstrap/ListGroup'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import './Admin.css'

class Admin extends React.Component {
  constructor(props) {
    super(props)

    let session = window.sessionStorage.getItem('session')

    if (!session) {
      history.push('/auth')
    }

    this.state = {
      session,

    }
  }

  render() {
    let { history } = this.props

    return (
      <Container className="Admin">
        <Row>
          <Col>
            <Card className="btn" bg="primary" text="white" onClick={() => history.push("/admin/cameras")}>
              <Card.Body>
                <Card.Title>Cameras</Card.Title>

                <Card.Text>
                  Click here to manage your school's cameras!
                        </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col>
            <Card bg="primary" text="white">
              <Card.Body>
                <Card.Title>Quick Facts</Card.Title>

                <Card.Text>
                  # of Cameras: 1 <br />
                  Est. Bandwidth: 60Mbps <br />
                  Server Health: <b className="healthy">Healthy</b>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card className="btn" bg="primary" text="white" onClick={() => history.push("/admin/import")}>
              <Card.Body>
                <Card.Title>Import Data</Card.Title>

                <Card.Text>
                Click here to import roster and class data with CSV files!
                        </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card bg="primary" text="white">
              <Card.Body>
                <Card.Title>Temporarily empty</Card.Title>

                <Card.Text>Temporarily empty</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    )
  }
}

class Camera extends React.Component {
  constructor(props) {
    super(props)

    let session = window.sessionStorage.getItem('session')

    if (!session) {
      history.push('/auth')
    }

    this.state = {
      session,
      cameras: [],
      editPopup: null
    }
  }

  updateCameras() {
    fetch(`https://api.edustream.live/admin/read/camera/?sid=fda734d93365f6ac6ced0f3d0c85aad460e1a8fc317c998c15546f6ab3d56f73&session=${this.state.session}`).then(data => data.json()).then(output => {
      this.setState({ cameras: output.cameras })
    })
  }

  componentDidMount() {
    console.log(this.props)
    this.updateTimer = setInterval(this.updateCameras.bind(this), 5000)
    this.updateCameras()
  }

  componentWillUnmount() {
    clearInterval(this.updateTimer)
  }

  render() {
    let closeEdit = () => {
      this.setState({ editPopup: null })
      this.updateCameras()
    }
    return (
      <Container className="Admin-Camera">
        <Button onClick={() => this.setState({ editPopup: <CameraEdit camera="new" closeEdit={closeEdit.bind(this)} /> })}>Add Camera</Button>
        <Button variant="success" onClick={() => fetch(`https://api.edustream.live/admin/start/all/?sid=${window.localStorage.getItem('sid')}&session=${window.sessionStorage.getItem('session')}`)}>Start All Cameras</Button>
        <Button variant="danger" onClick={() => fetch(`https://api.edustream.live/admin/stop/all/?sid=${window.localStorage.getItem('sid')}&session=${window.sessionStorage.getItem('session')}`)}>Stop All Cameras</Button>
        <ListGroup>
          {this.state.cameras.map((camera, id) => {
            return <div className="camera-list" key={id}><ListGroup.Item action variant="primary" onClick={() => this.setState({ editPopup: <CameraEdit camera={camera} closeEdit={closeEdit.bind(this)} /> })}>Room #: {camera.room} Address: {camera.address} Streaming: {camera.streaming} Recording: {camera.recording}</ListGroup.Item>{
              camera.streaming === 0 ? <Button variant="success" onClick={() => {

                fetch(`https://api.edustream.live/admin/start/camera/?sid=${window.localStorage.getItem('sid')}&session=${window.sessionStorage.getItem('session')}&cameraId=${camera.id}`)
              }
              }>Start Camera</Button> :
                <Button variant="danger" onClick={() => {

                  fetch(`https://api.edustream.live/admin/stop/camera/?sid=${window.localStorage.getItem('sid')}&session=${window.sessionStorage.getItem('session')}&cameraId=${camera.id}`)
                }
                }>Stop Camera</Button>}
              <a href={`/admin/watch?role=admin&room=${camera.room}`}><Button variant="primary">Watch</Button></a></div>
          })}
        </ListGroup>
        {this.state.editPopup}
      </Container>
    )
  }
}

class CameraEdit extends React.Component {
  constructor(props) {
    super(props)


    this.state = {
      camera: props.camera === 'new' ? {} : props.camera
    }
  }

  render() {
    return (
      <div className="CameraEdit">
        <form onSubmit={e => {
          e.preventDefault()

          let room = document.querySelector('#room input').value
          let address = document.querySelector('#address input').value

          fetch(`https://api.edustream.live/admin/${this.props.camera === 'new' ? 'create' : 'update'}/camera/?sid=${window.localStorage.getItem('sid')}&session=${window.sessionStorage.getItem('session')}&room=${room}&address=${address}&id=${this.state.camera.id}`).then(response => response.json()).then(data => {
            console.log(data)
            if (data.status) {
              this.props.closeEdit()
            }
          })
        }}>
          <InputGroup id="room" >
            <InputGroup.Prepend>
              <InputGroup.Text>#</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl placeholder="Room number" defaultValue={this.props.camera.room} />
          </InputGroup>
          <label>* Must include protocol!</label>
          <InputGroup id="address">
            <FormControl placeholder="IP camera's address" defaultValue={this.props.camera.address} />
          </InputGroup>

          <Button onClick={this.props.closeEdit}>Close</Button>
          <Button type="submit">Save Camera</Button>
        </form>
      </div>
    )
  }
}

class Import extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="Import">
        <form onSubmit={(e) => {
          e.preventDefault()
          console.log(document.querySelector('#peoplefile').files[0])
          fetch(`https://api.edustream.live/admin/import/people/?sid=${window.localStorage.getItem('sid')}&session=${window.sessionStorage.getItem('session')}`, {
            method: 'PUT',
            body: document.querySelector('#peoplefile').files[0]
          })
        }}>
          <label>People</label>
          <input type="file" id="peoplefile"></input>
          <Button type="submit">Submit Form</Button>
        </form>
        <form onSubmit={(e) => {
          e.preventDefault()
          console.log(document.querySelector('#classfile').files[0])
          fetch(`https://api.edustream.live/admin/import/classes/?sid=${window.localStorage.getItem('sid')}&session=${window.sessionStorage.getItem('session')}`, {
            method: 'PUT',
            body: document.querySelector('#classfile').files[0]
          })
        }}>
          <label>Classes</label>
          <input type="file" id="classfile"></input>
          <Button type="submit">Submit Form</Button>
        </form>
        <form onSubmit={(e) => {
          e.preventDefault()
          console.log(document.querySelector('#rosterfile').files[0])
          fetch(`https://api.edustream.live/admin/import/roster/?sid=${window.localStorage.getItem('sid')}&session=${window.sessionStorage.getItem('session')}`, {
            method: 'PUT',
            body: document.querySelector('#rosterfile').files[0]
          })
        }}>
          <label>Roster</label>
          <input type="file" id="rosterfile"></input>
          <Button type="submit">Submit Form</Button>
        </form>
        <form onSubmit={(e) => {
          e.preventDefault()
          console.log(document.querySelector('#periodfile').files[0])
          fetch(`https://api.edustream.live/admin/import/periods/?sid=${window.localStorage.getItem('sid')}&session=${window.sessionStorage.getItem('session')}`, {
            method: 'PUT',
            body: document.querySelector('#periodfile').files[0]
          })
        }}>
          <label>Periods</label>
          <input type="file" id="periodfile"></input>
          <Button type="submit">Submit Form</Button>
        </form>
      </div>
    )
  }
}

class ImportPeople extends React.Component {
  constructor(props) {
    super(props)

    let session = window.sessionStorage.getItem('session')

    if (!session) {
      history.push('/auth')
    }

    this.state = {
      session,
      people: [],
      editPopup: null
    }
  }

  updateCameras() {
    fetch(`https://api.edustream.live/admin/read/people/?sid=${window.localStorage.getItem('sid')}&session=${this.state.session}`).then(data => data.json()).then(output => {
      this.setState({ people: output.people })
    })
  }

  componentDidMount() {
    console.log(this.props)
    this.updateCameras()
  }

  render() {
    return (
      <Container className="ImportPeople">
        <Button onClick={() => this.setState({ editPopup: <CameraEdit camera="new" closeEdit={closeEdit.bind(this)} /> })}>Add Camera</Button>
        <Button variant="success" onClick={() => fetch(`https://api.edustream.live/admin/start/all/?sid=${window.localStorage.getItem('sid')}&session=${window.sessionStorage.getItem('session')}`)}>Start All Cameras</Button>
        <Button variant="danger" onClick={() => fetch(`https://api.edustream.live/admin/stop/all/?sid=${window.localStorage.getItem('sid')}&session=${window.sessionStorage.getItem('session')}`)}>Stop All Cameras</Button>
        <ListGroup>
          {this.state.cameras.map((camera, id) => {
            return <div className="camera-list" key={id}><ListGroup.Item action variant="primary" onClick={() => this.setState({ editPopup: <CameraEdit camera={camera} closeEdit={closeEdit.bind(this)} /> })}>Room #: {camera.room} Address: {camera.address} Streaming: {camera.streaming} Recording: {camera.recording}</ListGroup.Item>{
              camera.streaming === 0 ? <Button variant="success" onClick={() => {

                fetch(`https://api.edustream.live/admin/start/camera/?sid=${window.localStorage.getItem('sid')}&session=${window.sessionStorage.getItem('session')}&cameraId=${camera.id}`)
              }
              }>Start Camera</Button> :
                <Button variant="danger" onClick={() => {

                  fetch(`https://api.edustream.live/admin/stop/camera/?sid=${window.localStorage.getItem('sid')}&session=${window.sessionStorage.getItem('session')}&cameraId=${camera.id}`)
                }
                }>Stop Camera</Button>}
              <a href={`/admin/watch?role=admin&room=${camera.room}`}><Button variant="primary">Watch</Button></a></div>
          })}
        </ListGroup>
        {this.state.editPopup}
      </Container>
    )
  }
}

Admin.Camera = withRouter(Camera)
Admin.Import = withRouter(Import)
Admin.ImportPeople = withRouter(ImportPeople)

export default withRouter(Admin)
