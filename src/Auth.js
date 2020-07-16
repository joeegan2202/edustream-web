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

    window.localStorage.setItem("sid", "fda734d93365f6ac6ced0f3d0c85aad460e1a8fc317c998c15546f6ab3d56f73")

    fetch(`https://api.edustream.live/check/?sid=${window.localStorage.getItem('sid')}&session=${window.sessionStorage.getItem('session')}`).then(data => data.json()).then(output => {
      if(output.status) {
        this.props.headerCallback()
        switch (output.role) {
          case "A":
            this.props.history.push('/admin')
            break
          case "S":
            this.props.history.push('/watch?role=student')
            break
          case "T":
            this.props.history.push('/watch?role=teacher')
        }
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

              fetch(`https://api.edustream.live/auth/pass/?sid=${window.localStorage.getItem('sid')}&uname=${uname}`, {
                method: 'POST',
                body: hash.digest('hex')
              }).then(data => data.json()).then(output => {
                if (output.status) {
                  window.sessionStorage.setItem('session', output.session)
                  this.props.headerCallback()
                  switch(output.role) {
                  case "A":
                    history.push('/admin')
                    break
                  case "S":
                    history.push('/watch?role=student')
                    break
                  case "T":
                    history.push('/watch?role=teacher')
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
