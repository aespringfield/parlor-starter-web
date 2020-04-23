import React, { Component } from 'react';
import logo from './warpidge.jpg';
import './App.css';
import {
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect
} from 'react-router-dom';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Chat from './pages/Chat';
import Login from './pages/Login';
import Parlor from './pages/Parlor';
import { auth } from './services/firebase'


const PrivateRoute = ({ component: Component, authenticated, ...rest }) => {  
  return (
    <Route
      { ...rest }
      render={ (props) => authenticated === true
        ? <Component {...props} />
        : <Redirect to={{ pathname: '/login', state: { from: props.location }}} />
      }
    />
  )
}

const PublicRoute = ({ component: Component, authenticated, ...rest }) => {
  return (
    <Route
      {...rest}
      render={ (props) => authenticated === false
        ? <Component {...props} />
        : <Redirect to='/parlor' />
      }
    />
  )
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      authenticated: false,
      loading: true
    }
  }

  componentDidMount() {
    auth().onAuthStateChanged((user) => {
      if(user) {
        this.setState({
          authenticated: true,
          loading: false
        })
      } else {
        this.setState({
          authenticated: false,
          loading: false
        })
      }
    })
  }

  render() {
    return this.state.loading === true ? <h2>Loading...</h2> : (
      <Router>
        <Switch>
          <Route exact path="/" component={Home}></Route>
          <PrivateRoute path="/parlor" authenticated={this.state.authenticated} component={Parlor}></PrivateRoute>
          <PrivateRoute path="/chat" authenticated={this.state.authenticated} component={Chat}></PrivateRoute>
          <PublicRoute path="/signup" authenticated={this.state.authenticated} component={Signup}></PublicRoute>
          <PublicRoute path="/login" authenticated={this.state.authenticated} component={Login}></PublicRoute>
        </Switch>
      </Router>
    )
  }
}

export default App;
