import React from 'react'
import { withRouter } from 'react-router-dom'
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from "@reach/combobox"
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
            <Button onClick={() => this.setState({ loggedIn: !this.state.loggedIn })}>Log in</Button>
          </div>
        </div>
    )
  }
}

export default withRouter(Auth)
