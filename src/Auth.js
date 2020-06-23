import React from 'react'
import { withRouter } from 'react-router-dom'
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from "@reach/combobox"
import "@reach/combobox/styles.css"
import './Auth.css'

class Auth extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loggedIn: false,
      term: ''
    }
  }

  render() {
    let { history } = this.props

    return (
      this.state.loggedIn ?
        <div className="Auth">
          <div id="login-card">
            <h1>Logged in!</h1>

            <form onSubmit={() => {
              let school = document.querySelector('#school input').value

              switch (school) {
                case "A":
                  history.push('/admin')
                  break
                case "S":
                  history.push('/watch?role=student')
                  break
                case "T":
                  history.push('/watch?role=teacher')
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
            <button onClick={() => this.setState({ loggedIn: !this.state.loggedIn })}>Log in</button>
          </div>
        </div>
    )
  }
}

export default withRouter(Auth)
