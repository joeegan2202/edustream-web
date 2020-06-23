import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom"
import './App.css'

import Auth from './Auth'

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Link to="/">Go home!</Link>
          <Link to="/auth">Go to Auth!</Link>
        </header>

        <Switch>
          <Route path="/auth">
            <Auth />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

export default App
