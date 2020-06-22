import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom"
import logo from './logo.svg'
import './App.css'

import Auth from './Auth'

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
        </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
    <Link to="/">Go home!</Link>
            <Link to="/auth">Go to Auth!</Link>
          </a>
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
