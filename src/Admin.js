import React from 'react'
import crypto from 'crypto'
import { withRouter } from 'react-router-dom'
import ListGroup from 'react-bootstrap/ListGroup'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { API_URL } from './Variables'
import './lockicon.svg'
import './Admin.css'

var levDist = function(s, t) {
  var d = []; //2d matrix

  // Step 1
  var n = s.length;
  var m = t.length;

  if (n == 0) return m;
  if (m == 0) return n;

  //Create an array of arrays in javascript (a descending loop is quicker)
  for (var i = n; i >= 0; i--) d[i] = [];

  // Step 2
  for (var i = n; i >= 0; i--) d[i][0] = i;
  for (var j = m; j >= 0; j--) d[0][j] = j;

  // Step 3
  for (var i = 1; i <= n; i++) {
      var s_i = s.charAt(i - 1);

      // Step 4
      for (var j = 1; j <= m; j++) {

          //Check the jagged ld total so far
          if (i == j && d[i][j] > 4) return n;

          var t_j = t.charAt(j - 1);
          var cost = (s_i == t_j) ? 0 : 1; // Step 5

          //Calculate the minimum
          var mi = d[i - 1][j] + 1;
          var b = d[i][j - 1] + 1;
          var c = d[i - 1][j - 1] + cost;

          if (b < mi) mi = b;
          if (c < mi) mi = c;

          d[i][j] = mi; // Step 6

          //Damerau transposition
          if (i > 1 && j > 1 && s_i == t.charAt(j - 2) && s.charAt(i - 2) == t_j) {
              d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + cost);
          }
      }
  }

  // Step 7
  return d[n][m];
}

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
                <Card.Title>School Data</Card.Title>

                <Card.Text>
                Click here to import roster and class data with CSV files, or to manually edit school data!
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
    fetch(`https://${API_URL}/admin/read/camera/?sid=fda734d93365f6ac6ced0f3d0c85aad460e1a8fc317c998c15546f6ab3d56f73&session=${this.state.session}`).then(data => data.json()).then(output => {
      if(!output.status) {
        this.props.history.push('/auth')
      }
      this.setState({ cameras: output.cameras || [] })
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

  lockAll(cameras) {
    if(!cameras.length) return
    fetch(`https://${API_URL}/admin/lock/camera/?sid=${window.localStorage.getItem('sid')}&session=${window.sessionStorage.getItem('session')}&cameraID=${cameras[0].id}`).then(() => {
      this.lockAll(cameras.slice(1))
    })
  }

  unlockAll(cameras) {
    if(!cameras.length) return
    fetch(`https://${API_URL}/admin/unlock/camera/?sid=${window.localStorage.getItem('sid')}&session=${window.sessionStorage.getItem('session')}&cameraID=${cameras[0].id}`).then(() => {
      this.unlockAll(cameras.slice(1))
    })
  }

  onSearch(element) {
    let search = element.target.value
    this.state.cameras.forEach(camera => {
      camera.levDist = [levDist(camera.id, search), levDist(camera.room, search), levDist(camera.address, search)].sort()[0]
    })
    this.state.cameras.sort((c1, c2) => c1.levDist - c2.levDist)
    this.setState({})
  }

  render() {
    let closeEdit = () => {
      this.setState({ editPopup: null })
      this.updateCameras()
    }

    return (
      <Container className="Admin-Camera Import">
        <Button onClick={() => this.setState({ editPopup: <CameraEdit camera={false} closeEdit={closeEdit.bind(this)} /> })}>Add Camera</Button>
        <Button variant="success" onClick={() => fetch(`https://${API_URL}/admin/start/all/?sid=${window.localStorage.getItem('sid')}&session=${window.sessionStorage.getItem('session')}`)}>Start Unlocked Cameras</Button>
        <Button variant="danger" onClick={() => fetch(`https://${API_URL}/admin/stop/all/?sid=${window.localStorage.getItem('sid')}&session=${window.sessionStorage.getItem('session')}`)}>Stop Unlocked Cameras</Button>
        <Button variant="warning" onClick={this.lockAll.bind(this, this.state.cameras.filter(camera => !camera.locked))}>Lock All Cameras</Button>
        <Button variant="light" onClick={this.unlockAll.bind(this, this.state.cameras.filter(camera => camera.locked))}>Unlock All Cameras</Button>
        <input className="form-control" placeholder="Search" onChange={this.onSearch.bind(this)}></input>
        <ListGroup>
          {this.state.cameras.map((camera, id) => {
            return <div className="list" key={id}><ListGroup.Item action variant="primary" onClick={() => this.setState({ editPopup: <CameraEdit camera={camera} closeEdit={closeEdit.bind(this)} /> })}>Room #: <b>{camera.room}</b> Address: <b>{camera.address}</b></ListGroup.Item>
            <Button variant={camera.locked ? 'warning' : 'light'} onClick={camera.locked ? () => {

              fetch(`https://${API_URL}/admin/unlock/camera/?sid=${window.localStorage.getItem('sid')}&session=${window.sessionStorage.getItem('session')}&cameraID=${camera.id}`).then(this.updateCameras.bind(this))
            } : () => {

              fetch(`https://${API_URL}/admin/lock/camera/?sid=${window.localStorage.getItem('sid')}&session=${window.sessionStorage.getItem('session')}&cameraID=${camera.id}`).then(this.updateCameras.bind(this))
            }}><img src={camera.locked ? '/lockicon.svg' : '/unlockicon.svg'} style={{ width: '100%', height: '100%' }}></img></Button>{
              camera.lastStreamed < (Date.now()/1000)-30 ? <Button variant={camera.locked ? 'outline-success' : 'success'} disabled={camera.locked} onClick={camera.locked ? null : () => {

                fetch(`https://${API_URL}/admin/start/camera/?sid=${window.localStorage.getItem('sid')}&session=${window.sessionStorage.getItem('session')}&cameraID=${camera.id}`)
              }
              }>Start Camera</Button> :
                <Button variant={camera.locked ? 'outline-danger' : 'danger'} disabled={camera.locked} onClick={camera.locked ? null : () => {

                  fetch(`https://${API_URL}/admin/stop/camera/?sid=${window.localStorage.getItem('sid')}&session=${window.sessionStorage.getItem('session')}&cameraID=${camera.id}`)
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
      camera: props.camera
    }
  }

  render() {
    return (
      <div className="Edit">
        <form onSubmit={e => {
          e.preventDefault()

          let room = document.querySelector('#room input').value
          let address = document.querySelector('#address input').value

          fetch(`https://${API_URL}/admin/${this.props.camera ? 'update' : 'create'}/camera/?sid=${window.localStorage.getItem('sid')}&session=${window.sessionStorage.getItem('session')}&room=${room}&address=${address}&id=${this.state.camera.id}`).then(response => response.json()).then(data => {
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

          <div id="buttons">
            <Button onClick={this.props.closeEdit}>Close</Button>
            <Button variant='danger' onClick={() => {
              fetch(`https://${API_URL}/admin/delete/camera/?sid=${window.localStorage.getItem('sid')}&session=${window.sessionStorage.getItem('session')}&id=${this.state.camera.id}`).then(data => data.json()).then(output => {
                if(!output.status) {
                  this.props.history.push('/auth')
                }
                this.props.closeEdit()
              })
            }}>Delete Camera</Button>
            <Button type="submit">Save Camera</Button>
          </div>
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
    let { history } = this.props

    return (
      <div className="Import">
        <form onSubmit={(e) => {
          e.preventDefault()
          console.log(document.querySelector('#peoplefile').files[0])
          fetch(`https://${API_URL}/admin/import/people/?sid=${window.localStorage.getItem('sid')}&session=${window.sessionStorage.getItem('session')}`, {
            method: 'PUT',
            body: document.querySelector('#peoplefile').files[0]
          })
        }}>
          <label>People</label>
          <input type="file" id="peoplefile"></input>
          <Button type="submit">Submit Form</Button>
          <Button variant="primary" onClick={() => {
            history.push('/admin/import/people')
          }}>Edit Manually</Button>
        </form>
        <form onSubmit={(e) => {
          e.preventDefault()
          console.log(document.querySelector('#classfile').files[0])
          fetch(`https://${API_URL}/admin/import/classes/?sid=${window.localStorage.getItem('sid')}&session=${window.sessionStorage.getItem('session')}`, {
            method: 'PUT',
            body: document.querySelector('#classfile').files[0]
          })
        }}>
          <label>Classes</label>
          <input type="file" id="classfile"></input>
          <Button type="submit">Submit Form</Button>
          <Button variant="primary" onClick={() => {
            history.push('/admin/import/classes')
          }}>Edit Manually</Button>
        </form>
        <form onSubmit={(e) => {
          e.preventDefault()
          console.log(document.querySelector('#rosterfile').files[0])
          fetch(`https://${API_URL}/admin/import/roster/?sid=${window.localStorage.getItem('sid')}&session=${window.sessionStorage.getItem('session')}`, {
            method: 'PUT',
            body: document.querySelector('#rosterfile').files[0]
          })
        }}>
          <label>Roster</label>
          <input type="file" id="rosterfile"></input>
          <Button type="submit">Submit Form</Button>
          <Button variant="primary" onClick={() => {
            history.push('/admin/import/roster')
          }}>Edit Manually</Button>
        </form>
        <form onSubmit={(e) => {
          e.preventDefault()
          console.log(document.querySelector('#periodfile').files[0])
          fetch(`https://${API_URL}/admin/import/periods/?sid=${window.localStorage.getItem('sid')}&session=${window.sessionStorage.getItem('session')}`, {
            method: 'PUT',
            body: document.querySelector('#periodfile').files[0]
          })
        }}>
          <label>Periods</label>
          <input type="file" id="periodfile"></input>
          <Button type="submit">Submit Form</Button>
          <Button variant="primary" onClick={() => {
            history.push('/admin/import/periods')
          }}>Edit Manually</Button>
        </form>
        <form>
          <label>Authenticated Users</label>
          <input type="file" id="authfile"></input>
          <Button type="submit">Submit Form</Button>
          <Button variant="primary" onClick={() => {
            history.push('/admin/import/auth')
          }}>Edit Manually</Button>
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

  updatePeople() {
    fetch(`https://${API_URL}/admin/read/people/?sid=${window.localStorage.getItem('sid')}&session=${this.state.session}`).then(data => data.json()).then(output => {
      if(!output.status) {
        this.props.history.push('/auth')
      }
      this.setState({ people: output.people || [] })
    })
  }

  componentDidMount() {
    console.log(this.props)
    this.updatePeople()
  }

  onSearch(element) {
    let search = element.target.value
    this.state.people.forEach(person => {
      person.levDist = [levDist(person.id, search), levDist(person.uname, search), levDist(person.fname, search), levDist(person.lname, search)].sort()[0]
    })
    this.state.people.sort((p1, p2) => p1.levDist - p2.levDist)
    this.setState({})
  }

  render() {
    let closeEdit = () => {
      this.setState({ editPopup: null })
      this.updatePeople()
    }

    return (
      <Container className="ImportPeople Import">
        <Button onClick={() => this.setState({ editPopup: <PersonEdit person={false} closeEdit={closeEdit.bind(this)} /> })}>Add Person</Button>
        <input className="form-control" placeholder="Search" onChange={this.onSearch.bind(this)}></input>
        <ListGroup>
          {this.state.people.map((person, id) => {
            return <div className="person-list" key={id}><ListGroup.Item action variant="primary" onClick={() => this.setState({
              editPopup: <PersonEdit person={person} closeEdit={closeEdit.bind(this)} /> 
            })}>ID: <b>{person.id}</b> Username: <b>{person.uname}</b> First name: <b>{person.fname}</b> Last name: <b>{person.lname}</b> Role: <b>{person.role}</b></ListGroup.Item></div>
          })}
        </ListGroup>
        {this.state.editPopup}
      </Container>
    )
  }
}

class PersonEdit extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      person: props.person
    }
  }

  render() {
    return (
      <div className="Edit PersonEdit">
        <form onSubmit={e => {
          e.preventDefault()

          let uname = document.querySelector('#uname input').value
          let fname = document.querySelector('#fname input').value
          let lname = document.querySelector('#lname input').value
          let role = document.querySelector('#role input').value

          let hash = crypto.createHash('sha256')
          hash.update(uname + Date.now())

          let csv = `id,uname,fname,lname,role\n${this.state.person.id || hash.digest('hex')},${uname},${fname},${lname},${role}`

          fetch(`https://${API_URL}/admin/import/people/?sid=${window.localStorage.getItem('sid')}&session=${window.sessionStorage.getItem('session')}`, {
            method: "PUT",
            body: csv
          }).then(response => response.json()).then(data => {
            console.log(data)
            if (data.status) {
              this.props.closeEdit()
            }
          })
        }}>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>ID</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl value={this.props.person.id} readOnly />
          </InputGroup>
          <InputGroup id="uname" >
            <InputGroup.Prepend>
              <InputGroup.Text>Username</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl placeholder="Username/Identity" defaultValue={this.props.person.uname} />
          </InputGroup>
          <InputGroup id="fname">
            <InputGroup.Prepend>
              <InputGroup.Text>First name</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl placeholder="First name" defaultValue={this.props.person.fname} />
          </InputGroup>
          <InputGroup id="lname">
            <InputGroup.Prepend>
              <InputGroup.Text>Last name</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl placeholder="Last name" defaultValue={this.props.person.lname} />
          </InputGroup>
          <InputGroup id="role">
            <InputGroup.Prepend>
              <InputGroup.Text>Role</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl placeholder="Role" defaultValue={this.props.person.role} />
          </InputGroup>

          <Button onClick={this.props.closeEdit}>Close</Button>
            {this.state.person ? <Button variant='danger' onClick={() => {
              fetch(`https://${API_URL}/admin/delete/people/?sid=${window.localStorage.getItem('sid')}&session=${window.sessionStorage.getItem('session')}&id=${this.state.person.id}`).then(data => data.json()).then(output => {
                if(!output.status) {
                  this.props.history.push('/auth')
                }
                this.props.closeEdit()
              })
            }}>Delete Person</Button> : null}
          <Button type="submit">Save Person</Button>
        </form>
      </div>
    )
  }
}

class ImportClasses extends React.Component {
  constructor(props) {
    super(props)

    let session = window.sessionStorage.getItem('session')

    if (!session) {
      history.push('/auth')
    }

    this.state = {
      session,
      classes: [],
      editPopup: null
    }
  }

  updateClasses() {
    fetch(`https://${API_URL}/admin/read/classes/?sid=${window.localStorage.getItem('sid')}&session=${this.state.session}`).then(data => data.json()).then(output => {
      if(!output.status) {
        this.props.history.push('/auth')
      }
      this.setState({ classes: output.classes || [] })
    })
  }

  componentDidMount() {
    console.log(this.props)
    this.updateClasses()
  }

  onSearch(element) {
    let search = element.target.value
    this.state.classes.forEach(course => {
      course.levDist = [levDist(course.id, search), levDist(course.name, search), levDist(course.room, search)].sort()[0]
    })
    this.state.classes.sort((c1, c2) => c1.levDist - c2.levDist)
    this.setState({})
  }

  render() {
    let closeEdit = () => {
      this.setState({ editPopup: null })
      this.updateClasses()
    }

    return (
      <Container className="Import ImportClasses">
        <Button onClick={() => this.setState({ editPopup: <ClassEdit course={false} closeEdit={closeEdit.bind(this)} /> })}>Add Class</Button>
        <input className="form-control" placeholder="Search" onChange={this.onSearch.bind(this)}></input>
        <ListGroup>
          {this.state.classes.map((course, id) => {
            return <div className="List ClassList" key={id}><ListGroup.Item action variant="primary" onClick={() => this.setState({
              editPopup: <ClassEdit course={course} closeEdit={closeEdit.bind(this)} /> 
            })}>ID: <b>{course.id}</b> Name: <b>{course.name}</b> Room: <b>{course.room}</b> Period: <b>{course.period}</b></ListGroup.Item></div>
          })}
        </ListGroup>
        {this.state.editPopup}
      </Container>
    )
  }
}

class ClassEdit extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      course: props.course
    }
  }

  render() {
    return (
      <div className="Edit ClassEdit">
        <form onSubmit={e => {
          e.preventDefault()

          let name = document.querySelector('#name input').value
          let room = document.querySelector('#room input').value
          let period = document.querySelector('#period input').value

          let hash = crypto.createHash('sha256')
          hash.update(name + room + Date.now())

          let csv = `id,name,room,period\n${this.state.course.id || hash.digest('hex')},${name},${room},${period}`

          fetch(`https://${API_URL}/admin/import/classes/?sid=${window.localStorage.getItem('sid')}&session=${window.sessionStorage.getItem('session')}`, {
            method: "PUT",
            body: csv
          }).then(response => response.json()).then(data => {
            console.log(data)
            if (data.status) {
              this.props.closeEdit()
            }
          })
        }}>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>ID</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl value={this.props.course.id} readOnly />
          </InputGroup>
          <InputGroup id="name" >
            <InputGroup.Prepend>
              <InputGroup.Text>Class name</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl placeholder="Class name" defaultValue={this.props.course.name} />
          </InputGroup>
          <InputGroup id="room">
            <InputGroup.Prepend>
              <InputGroup.Text>Room code</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl placeholder="Room code" defaultValue={this.props.course.room} />
          </InputGroup>
          <InputGroup id="period">
            <InputGroup.Prepend>
              <InputGroup.Text>Period</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl placeholder="Period" defaultValue={this.props.course.period} />
          </InputGroup>

          <Button onClick={this.props.closeEdit}>Close</Button>
            {this.state.course ? <Button variant='danger' onClick={() => {
              fetch(`https://${API_URL}/admin/delete/classes/?sid=${window.localStorage.getItem('sid')}&session=${window.sessionStorage.getItem('session')}&id=${this.state.course.id}`).then(data => data.json()).then(output => {
                if(!output.status) {
                  this.props.history.push('/auth')
                }
                this.props.closeEdit()
              })
            }}>Delete Class</Button> : null}
          <Button type="submit">Save Class</Button>
        </form>
      </div>
    )
  }
}

class ImportRoster extends React.Component {
  constructor(props) {
    super(props)

    let session = window.sessionStorage.getItem('session')

    if (!session) {
      history.push('/auth')
    }

    this.state = {
      session,
      roster: [],
      editPopup: null
    }
  }

  updateRoster() {
    fetch(`https://${API_URL}/admin/read/roster/?sid=${window.localStorage.getItem('sid')}&session=${this.state.session}`).then(data => data.json()).then(output => {
      if(!output.status) {
        this.props.history.push('/auth')
      }
      this.setState({ roster: output.roster || [] })
    })
  }

  componentDidMount() {
    console.log(this.props)
    this.updateRoster()
  }

  render() {
    let closeEdit = () => {
      this.setState({ editPopup: null })
      this.updateRoster()
    }

    return (
      <Container className="Import ImportRoster">
        <Button onClick={() => this.setState({ editPopup: <RosterEdit entry={false} closeEdit={closeEdit.bind(this)} /> })}>Add Roster</Button>
        <ListGroup>
          {this.state.roster.map((entry, id) => {
            return <div className="List RosterList" key={id}><ListGroup.Item action variant="primary" onClick={() => this.setState({
              editPopup: <RosterEdit entry={entry} closeEdit={closeEdit.bind(this)} /> 
            })}>PersonID: <b>{entry.pid}</b> ClassID: <b>{entry.cid}</b></ListGroup.Item></div>
          })}
        </ListGroup>
        {this.state.editPopup}
      </Container>
    )
  }
}

class RosterEdit extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      entry: props.entry
    }
  }

  render() {
    return (
      <div className="Edit RosterEdit">
        <form onSubmit={e => {
          e.preventDefault()

          let pid = document.querySelector('#pid input').value
          let cid = document.querySelector('#cid input').value

          let csv = `pid,cid\n${pid},${cid}`

          fetch(`https://${API_URL}/admin/import/roster/?sid=${window.localStorage.getItem('sid')}&session=${window.sessionStorage.getItem('session')}`, {
            method: "PUT",
            body: csv
          }).then(response => response.json()).then(data => {
            console.log(data)
            if (data.status) {
              this.props.closeEdit()
            }
          })
        }}>
          <InputGroup id="pid" >
            <InputGroup.Prepend>
              <InputGroup.Text>PersonID</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl placeholder="PersonID" defaultValue={this.props.entry.pid} />
          </InputGroup>
          <InputGroup id="cid">
            <InputGroup.Prepend>
              <InputGroup.Text>ClassID</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl placeholder="ClassID" defaultValue={this.props.entry.cid} />
          </InputGroup>

          <Button onClick={this.props.closeEdit}>Close</Button>
          <Button type="submit">Save Roster Entry</Button>
        </form>
      </div>
    )
  }
}

function getFullTimeString(time) {
  let date = new Date(time*1000)
  switch(date.getUTCMonth()) {
  case 0:
    return `Jan. ${date.getUTCDate()} ${date.toLocaleTimeString('en-US')}`
  case 1:
    return `Feb. ${date.getUTCDate()} ${date.toLocaleTimeString('en-US')}`
  case 2:
    return `Mar. ${date.getUTCDate()} ${date.toLocaleTimeString('en-US')}`
  case 3:
    return `Apr. ${date.getUTCDate()} ${date.toLocaleTimeString('en-US')}`
  case 4:
    return `May. ${date.getUTCDate()} ${date.toLocaleTimeString('en-US')}`
  case 5:
    return `Jun. ${date.getUTCDate()} ${date.toLocaleTimeString('en-US')}`
  case 6:
    return `Jul. ${date.getUTCDate()} ${date.toLocaleTimeString('en-US')}`
  case 7:
    return `Aug. ${date.getUTCDate()} ${date.toLocaleTimeString('en-US')}`
  case 8:
    return `Sep. ${date.getUTCDate()} ${date.toLocaleTimeString('en-US')}`
  case 9:
    return `Oct. ${date.getUTCDate()} ${date.toLocaleTimeString('en-US')}`
  case 10:
    return `Nov. ${date.getUTCDate()} ${date.toLocaleTimeString('en-US')}`
  case 11:
    return `Dec. ${date.getUTCDate()} ${date.toLocaleTimeString('en-US')}`
  }
}

class ImportPeriods extends React.Component {
  constructor(props) {
    super(props)

    let session = window.sessionStorage.getItem('session')

    if (!session) {
      history.push('/auth')
    }

    this.state = {
      session,
      periods: [],
      editPopup: null
    }
  }

  updatePeriods() {
    fetch(`https://${API_URL}/admin/read/periods/?sid=${window.localStorage.getItem('sid')}&session=${this.state.session}`).then(data => data.json()).then(output => {
      if(!output.status) {
        this.props.history.push('/auth')
      }
      this.setState({ periods: output.periods || [] })
    })
  }

  componentDidMount() {
    console.log(this.props)
    this.updatePeriods()
  }

  render() {
    let closeEdit = () => {
      this.setState({ editPopup: null })
      this.updatePeriods()
    }

    return (
      <Container className="Import ImportPeriods">
        <Button onClick={() => this.setState({ editPopup: <PeriodEdit period={false} closeEdit={closeEdit.bind(this)} /> })}>Add Period</Button>
        <ListGroup>
          {this.state.periods.map((period, id) => {
            return <div className="List PeriodList" key={id}><ListGroup.Item action variant="primary" onClick={() => this.setState({
              editPopup: <PeriodEdit period={period} closeEdit={closeEdit.bind(this)} /> 
            })}>Code: <b>{period.code}</b> Start Time: <b>{getFullTimeString(period.stime)}</b> End Time: <b>{getFullTimeString(period.etime)}</b></ListGroup.Item></div>
          })}
        </ListGroup>
        {this.state.editPopup}
      </Container>
    )
  }
}

class PeriodEdit extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      period: props.period
    }
  }

  render() {
    return (
      <div className="Edit PeriodEdit">
        <form onSubmit={e => {
          e.preventDefault()

          let date = new Date()
          let code = document.querySelector('#code input').value
          let stime = new Date(document.querySelector('#stime input').value)
          let etime = new Date(document.querySelector('#etime input').value)

          let csv = `code,stime,etime\n${code},${stime.getTime()/1000},${etime.getTime()/1000}`

          fetch(`https://${API_URL}/admin/import/periods/?sid=${window.localStorage.getItem('sid')}&session=${window.sessionStorage.getItem('session')}`, {
            method: "PUT",
            body: csv
          }).then(response => response.json()).then(data => {
            console.log(data)
            if (data.status) {
              this.props.closeEdit()
            }
          })
        }}>
          <InputGroup id="code" >
            <InputGroup.Prepend>
              <InputGroup.Text>Period Code</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl placeholder="Code" defaultValue={this.props.period.code} />
          </InputGroup>
          <InputGroup id="stime">
            <InputGroup.Prepend>
              <InputGroup.Text>Start Time</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl type="datetime-local" defaultValue={new Date((this.props.period.stime || 0) * 1000).toISOString()} />
          </InputGroup>
          <InputGroup id="etime">
            <InputGroup.Prepend>
              <InputGroup.Text>End Time</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl type="datetime-local" defaultValue={new Date((this.props.period.stime || 0) * 1000).toISOString()} />
          </InputGroup>

          <Button onClick={this.props.closeEdit}>Close</Button>
            {this.state.period ? <Button variant='danger' onClick={() => {
              fetch(`https://${API_URL}/admin/delete/periods/?sid=${window.localStorage.getItem('sid')}&session=${window.sessionStorage.getItem('session')}&id=${this.state.period.id}`).then(data => data.json()).then(output => {
                if(!output.status) {
                  this.props.history.push('/auth')
                }
                this.props.closeEdit()
              })
            }}>Delete Period</Button> : null}
          <Button type="submit">Save Roster Entry</Button>
        </form>
      </div>
    )
  }
}

class ImportAuth extends React.Component {
  constructor(props) {
    super(props)

    let session = window.sessionStorage.getItem('session')

    if (!session) {
      history.push('/auth')
    }

    this.state = {
      session,
      auth: [],
      editPopup: null
    }
  }

  updateAuth() {
    fetch(`https://${API_URL}/admin/read/auth/?sid=${window.localStorage.getItem('sid')}&session=${this.state.session}`).then(data => data.json()).then(output => {
      if(!output.status) {
        this.props.history.push('/auth')
      }
      this.setState({ auth: output.auth || [] })
    })
  }

  componentDidMount() {
    console.log(this.props)
    this.updateAuth()
  }

  onSearch(element) {
    let search = element.target.value
    this.state.auth.forEach(auth => {
      auth.levDist = [levDist(auth.pid, search), levDist(auth.uname, search)].sort()[0]
    })
    this.state.auth.sort((a1, a2) => a1.levDist - a2.levDist)
    this.setState({})
  }

  render() {
    let closeEdit = () => {
      this.setState({ editPopup: null })
      this.updateAuth()
    }

    return (
      <Container className="ImportAuth Import">
        <Button onClick={() => this.setState({ editPopup: <AuthEdit auth={false} closeEdit={closeEdit.bind(this)} /> })}>Add Authenitcated User</Button>
        <input className="form-control" placeholder="Search" onChange={this.onSearch.bind(this)}></input>
        <ListGroup>
          {this.state.auth.map((auth, id) => {
            return <div className="auth-list" key={id}><ListGroup.Item action variant="primary" onClick={() => this.setState({
              editPopup: <AuthEdit auth={auth} closeEdit={closeEdit.bind(this)} /> 
            })}>ID: <b>{auth.pid}</b> Username: <b>{auth.uname}</b></ListGroup.Item></div>
          })}
        </ListGroup>
        {this.state.editPopup}
      </Container>
    )
  }
}

class AuthEdit extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      auth: props.auth
    }
  }

  render() {
    return (
      <div className="Edit AuthEdit">
        <form onSubmit={e => {
          e.preventDefault()

          let pid = document.querySelector('#pid input').value
          let pword = document.querySelector('#pword input').value

          let hash = crypto.createHash('sha256')
          hash.update(pword)

          fetch(`https://${API_URL}/admin/update/auth/?sid=${window.localStorage.getItem('sid')}&session=${window.sessionStorage.getItem('session')}&pid=${pid}`, {
            method: "POST",
            body: hash.digest('hex')
          }).then(response => response.json()).then(data => {
            console.log(data)
            if (data.status) {
              this.props.closeEdit()
            }
          })
        }}>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>Username</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl value={this.props.auth.uname} readOnly />
          </InputGroup>
          <InputGroup id="pid" >
            <InputGroup.Prepend>
              <InputGroup.Text>PersonID</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl placeholder="PersonID" defaultValue={this.props.auth.pid} />
          </InputGroup>
          <InputGroup id="pword">
            <InputGroup.Prepend>
              <InputGroup.Text>Password</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl type="password" placeholder="Password" />
          </InputGroup>

          <Button onClick={this.props.closeEdit}>Close</Button>
          <Button type="submit">Save Authenticated User</Button>
        </form>
      </div>
    )
  }
}


Admin.Camera = withRouter(Camera)
Admin.Import = withRouter(Import)
Admin.ImportPeople = withRouter(ImportPeople)
Admin.ImportClasses = withRouter(ImportClasses)
Admin.ImportRoster = withRouter(ImportRoster)
Admin.ImportPeriods = withRouter(ImportPeriods)
Admin.ImportAuth = withRouter(ImportAuth)

export default withRouter(Admin)
