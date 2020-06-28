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
    this.updateCameras()
  }

  render() {
    let closeEdit = () => {
      this.setState({ editPopup: null })
      this.updateCameras()
    }
    return (
      <Container className="Admin-Camera">
        <Button onClick={() => this.setState({ editPopup: <CameraEdit camera="new" closeEdit={closeEdit.bind(this)} /> })}>Add Camera</Button>
        <ListGroup>
          {this.state.cameras.map((camera, id) => {
            return <ListGroup.Item action variant="primary" key={id} onClick={() => this.setState({ editPopup: <CameraEdit camera={camera} closeEdit={closeEdit.bind(this)} /> })}>Room #: {camera.room} Address: {camera.address} Streaming: {camera.streaming} Recording: {camera.recording}</ListGroup.Item>
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
          let streaming = document.querySelector('#streaming').checked
          let recording = document.querySelector('#recording').checked

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
          <span className="input-group-text">
            Streaming? <input type="checkbox" id="streaming" /> Recording? <input type="checkbox" id="recording" />
          </span>

          <Button onClick={this.props.closeEdit}>Close</Button>
          <Button type="submit">Save Camera</Button>
        </form>
      </div>
    )
  }
}

Admin.Camera = withRouter(Camera)

export default withRouter(Admin)
