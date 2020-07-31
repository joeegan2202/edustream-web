import React from 'react'
import crypto from 'crypto'
import { withRouter } from 'react-router-dom'
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from "@reach/combobox"
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import "@reach/combobox/styles.css"
import './Auth.css'
import { API_URL } from './Variables'

class Auth extends React.Component {
  constructor(props) {
    super(props)

    window.localStorage.setItem("sid", "fda734d93365f6ac6ced0f3d0c85aad460e1a8fc317c998c15546f6ab3d56f73")

    fetch(`https://${API_URL}/check/?sid=${window.localStorage.getItem('sid')}&session=${window.sessionStorage.getItem('session')}`).then(data => data.json()).then(output => {
      if(output.status) {
        switch (output.role) {
          case "A":
            this.props.history.replace('/admin')
            break
          case "S":
            this.props.history.replace('/watch?role=student')
            break
          case "T":
            this.props.history.replace('/watch?role=teacher')
        }
      } else {
        window.sessionStorage.removeItem('session')
      }
    })

    this.state = {
      loggedIn: false,
      term: ''
    }
  }

  render() {
    let { history } = this.props

    return (
        <div className="Auth">
          <div id="login-card">
            <form onSubmit={e => {
              e.preventDefault()

              let uname = document.querySelector('#uname input').value
              let pword = document.querySelector('#pword input').value
              let hash = crypto.createHash('sha256')
              hash.update(pword)

              fetch(`https://${API_URL}/auth/pass/?uname=${uname}`, {
                method: 'POST',
                body: hash.digest('hex')
              }).then(data => data.json()).then(output => {
                if (output.status) {
                  window.localStorage.setItem('sid', output.sid)
                  window.sessionStorage.setItem('session', output.session)
                  window.sessionStorage.setItem('bannerURL', output.bannerURL)
                  this.props.headerCallback()
                  switch(output.role) {
                  case "A":
                    history.replace('/admin')
                    break
                  case "S":
                    history.replace('/watch?role=student')
                    break
                  case "T":
                    history.replace('/watch?role=teacher')
                  }
                } else {
                  console.log(output)
                  window.sessionStorage.setItem('session', '')
                  this.props.headerCallback()
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
