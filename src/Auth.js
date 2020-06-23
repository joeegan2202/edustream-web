import React from 'react'
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
    return (
      this.state.loggedIn ?
        <div className="Auth">
          <h1>Logged in!</h1>
          <Combobox>
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
        </div> :
        <div className="Auth">
          <h1>Go back to normal auth!</h1>
          <div className="Auth">
            <div id="login-card">
              <button onClick={() => this.setState({ loggedIn: !this.state.loggedIn })}>Log in</button>
            </div>
          </div>
        </div>
    )
  }
}

export default Auth
