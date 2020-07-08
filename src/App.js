import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom"
import './App.css'

import Auth from './Auth'
import Admin from './Admin'
import Watch from './Watch'

class App extends React.Component {
  constructor(props) {
    super(props)

    window.localStorage.setItem('sid', 'fda734d93365f6ac6ced0f3d0c85aad460e1a8fc317c998c15546f6ab3d56f73')
    this.state = {
    }
  }

  render() {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <Link to="/"><h1>Go home!</h1></Link>
            <Link to="/auth">Go to Auth!</Link>
          </header>

          <Switch>
            <Route exact path="/">
              <div id="give-space"><h1>Welcome to EduStream! Best school streaming... Ever!</h1></div>
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
            <Route path="/auth">
              <Auth />
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
