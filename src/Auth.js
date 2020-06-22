import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link, withRouter } from "react-router-dom"

class Auth extends React.Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  render() {
    console.log(this.props.match.url)
    return (
      <Router>
        <div className="Auth">
          <Switch>
            <Route exact path={`${this.props.match.url}`}>
              <div id="login-card">
                <Link to={`${this.props.match.url}/logged-in`}><button>Login with google!</button></Link>
              </div>
            </Route>
            <Route exact path={`${this.props.match.url}/logged-in`}>
              <h1>Logged in!</h1>
              <Link to={`${this.props.match.url}`}>
                <h1>Go back to normal auth!</h1>
              </Link>
            </Route>
          </Switch>
        </div >
      </Router >
    )
  }
}

export default withRouter(Auth)
