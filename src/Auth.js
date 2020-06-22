import React from 'react'
import { Link, withRouter } from "react-router-dom"

class Auth extends React.Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  render() {
    console.log(this.props.match.url)
    return (
      <div className="Auth">
        <div id="login-card">
          <Link to={`${this.props.match.url}/logged-in`}><button>Login with google!</button></Link>
        </div>
      </div >
    )
  }
}

class AuthLoggedIn extends React.Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  render() {
    return (
      <div className="Auth">

      </div>
    )
  }
}

let routedAuth = withRouter(Auth)
let routedAuthLoggedIn = withRouter(AuthLoggedIn)

export { routedAuth as Auth, routedAuthLoggedIn as AuthLoggedIn }
