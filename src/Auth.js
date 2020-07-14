import React from 'react'
import crypto from 'crypto'
import { withRouter } from 'react-router-dom'
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from "@reach/combobox"
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import "@reach/combobox/styles.css"
import './Auth.css'

class Auth extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loggedIn: false,
      term: ''
    }

    window.localStorage.setItem("sid", "fda734d93365f6ac6ced0f3d0c85aad460e1a8fc317c998c15546f6ab3d56f73")
  }

  render() {
    let { history } = this.props

    return (
      this.state.loggedIn ?
        <div className="Auth">
          <div id="login-card">
            <h1>Logged in!</h1>

            <form onSubmit={(e) => {
              e.preventDefault()
              let school = document.querySelector('#school input').value

              switch (school) {
                case "A":
                  fetch(`https://api.edustream.live/auth/?sid=${window.localStorage.getItem('sid')}&uname=admin`).then(data => data.json()).then(output => {
                    if (output.status) {
                      window.sessionStorage.setItem('session', output.session)
                      history.push('/admin')
                    } else {
                      console.log(output)
                      window.alert("Error! " + output.err)
                    }
                  })
                  break
                case "S":
                  fetch(`https://api.edustream.live/auth/?sid=${window.localStorage.getItem('sid')}&uname=jeegan21`).then(data => data.json()).then(output => {
                    if (output.status) {
                      window.sessionStorage.setItem('session', output.session)
                      history.push('/watch?role=student')
                    } else {
                      console.log(output)
                      window.alert("Error! " + output.err)
                    }
                  })
                  break
                case "T":
                  fetch(`https://api.edustream.live/auth/?sid=${window.localStorage.getItem('sid')}&uname=jeegan21`).then(data => data.json()).then(output => {
                    if (output.status) {
                      window.sessionStorage.setItem('session', output.session)
                      history.push('/watch?role=teacher')
                    } else {
                      console.log(output)
                      window.alert("Error! " + output.err)
                    }
                  })
                  break
              }

            }}>
              <Combobox className="Combobox" id="school">
                <ComboboxInput onChange={event => this.setState({ term: event.target.value })} />
                <ComboboxPopover>
                  <ComboboxList>
                    <ComboboxOption value="Test" />
                    <ComboboxOption value="Test1" />
                    <ComboboxOption value="Test2" />
                    <ComboboxOption value="Test3" />
                    <ComboboxOption value="Test4" />
                    <ComboboxOption value="Test5" />
                    <ComboboxOption value="Another" />
                  </ComboboxList>
                </ComboboxPopover>
              </Combobox>
            </form>
          </div>
        </div> :

        <div className="Auth">
          <div id="login-card">
            <form onSubmit={e => {
              e.preventDefault()

              let uname = document.querySelector('#uname input').value
              let pword = document.querySelector('#pword input').value
              let hash = crypto.createHash('sha256')
              hash.update(pword)

              fetch(`https://api.edustream.live/auth/pass/?sid=${window.localStorage.getItem('sid')}&uname=${uname}`, {
                method: 'POST',
                body: hash.digest('hex')
              }).then(data => data.json()).then(output => {
                if (output.status) {
                  window.sessionStorage.setItem('session', output.session)
                  if (output.role == 'A') {
                    history.push('/admin')
                  } else {
                    history.push('/watch?role=student')
                  }
                } else {
                  console.log(output)
                  window.alert("Error! " + output.err)
                }
              })
            }}>
              <InputGroup id="uname">
                <InputGroup.Prepend>
                  <InputGroup.Text>Username</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl placeholder="Username" />
              </InputGroup>
              <InputGroup id="pword">
                <InputGroup.Prepend>
                  <InputGroup.Text>Password</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl type="password" placeholder="Password" />
              </InputGroup>
              <Button type="submit">Log in</Button>
            </form>
          </div>
        </div>
    )
  }
}

export default withRouter(Auth)
