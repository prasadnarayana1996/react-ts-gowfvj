import React, { Component } from 'react';
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import Login from './Login/Login';
// import Recruiter from './recruiter/Recruiter';
// import Client from './Client/Client';
// import Resource from './Resource/Resource';
// import ForgotPassword from './ForgotPassword/ForgotPassword';
// import ChangePassword from './ChangePassword/ChangePassword';
import { NotificationContainer } from 'react-notifications';
// import Requirement from './Requirement/Requirement';
// import Dashboard from './Dashboard/Dashboard';
// import Verification from './ForgotPassword/Verification';
// import Temp from './ForgotPassword/Temp';
// import Employer from './Employer/Employer';
// import InValidPage from './Login/InValidPage';
//import MappedList from './Resource/Mapped-Requirements/MappedList';

export default class Routes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      validUser: false,
    };
  }
  componentDidMount() {
    if (localStorage.getItem('token')) {
      this.ValidatingUser(true);
    }
  }

  ValidatingUser = (value) => {
    // console.log(value);

    this.setState({
      validUser: value,
    });
  };
  render() {
    // console.log(this.state.validUser);

    return (
      <Router>
        <div>
          <Switch>
            <Route
              exact={true}
              path="/"
              render={(props) => (
                <Login
                  ValidatingUser={(e) => this.ValidatingUser(e)}
                  {...props}
                />
              )}
            ></Route>
          </Switch>

          <NotificationContainer />
        </div>
      </Router>
    );
  }
}
