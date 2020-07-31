import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom"
import './App.css'
import Dropdown from 'react-bootstrap/Dropdown'
import Button from 'react-bootstrap/Button'
import Auth from './Auth'
import Admin from './Admin'
import Watch from './Watch'
import Home from './Home'

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
    }
  }

  render() {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <Link to="/" className="HeaderText"><h1><img src={window.sessionStorage.getItem('bannerURL')}></img></h1></Link>
            {window.sessionStorage.getItem('session') ? <Dropdown>
              <Dropdown.Toggle as="div" className="HeaderAuth">
                <img src="/avataricon.svg" alt="Go to Auth!" />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="/auth">
                  Watch
                </Dropdown.Item>
                <Dropdown.Item href="/" onClick={() => {
                  window.sessionStorage.removeItem('session')
                  this.setState({})
                }}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown> : <Link to="/auth" className="HeaderAuth"><Button variant="primary">Log In</Button></Link>}
          </header>

          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route exact path="/admin">
              <Admin />
            </Route>
            <Route exact path="/admin/watch">
              <Watch />
            </Route>
            <Route exact path="/admin/cameras">
              <Admin.Camera />
            </Route>
            <Route exact path="/admin/import">
              <Admin.Import />
            </Route>
            <Route exact path="/admin/import/people">
              <Admin.ImportPeople />
            </Route>
            <Route exact path="/admin/import/classes">
              <Admin.ImportClasses />
            </Route>
            <Route exact path="/admin/import/roster">
              <Admin.ImportRoster />
            </Route>
            <Route exact path="/admin/import/periods">
              <Admin.ImportPeriods />
            </Route>
            <Route exact path="/admin/import/auth">
              <Admin.ImportAuth />
            </Route>
            <Route path="/auth">
              <Auth headerCallback={(() => this.setState({})).bind(this)} />
            </Route>
            <Route path="/watch">
              <Watch />
            </Route>
          </Switch>
        </div>
      </Router>
    )
  }
}

export default App
