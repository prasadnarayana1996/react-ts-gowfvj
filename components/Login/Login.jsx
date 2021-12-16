import React, { Component } from 'react';
import { Input, Form, Button } from 'reactstrap';
import './Login.scss';
import { Route } from 'react-router-dom';
import service from '../../api/service';
import { Redirect, Link, withRouter } from 'react-router-dom';
import { NotificationContainer } from 'react-notifications';
import { NotificationManager } from 'react-notifications';
import Loader from 'react-loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import logo from '../Layout/Images/abhra_logo.png';
import options from '../Layout/Loading';
import Dashboard from '../Dashboard/Dashboard';
import { connect } from 'react-redux';

const optionsLoad = new options();
const API = new service();

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recruiter_email: '',
      password: '',
      redirect: false,
      alert: false,
      alertMessage: '',
      formErrors: { email: '', password: '' },
      emailValid: false,
      passwordValid: false,
      formValid: false,
      loaded: true,
      type: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.renderRedirect = this.renderRedirect.bind(this);
    this.setRedirect = this.setRedirect.bind(this);
  }

  handleChange = (e) => {
    // console.log(e.target.name+' '+ e.target.value);

    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value }, () => {
      this.validateField(name, value);
    });
    // console.log(this.state);
  };
  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    let emailValid = this.state.emailValid;
    let passwordValid = this.state.passwordValid;

    switch (fieldName) {
      case 'recruiter_email':
        emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        // console.log(emailValid);

        fieldValidationErrors.email = emailValid ? '' : 'Email is invalid';
        break;
      case 'password':
        passwordValid = value.length >= 6;
        //console.log(passwordValid);

        fieldValidationErrors.password = passwordValid
          ? ''
          : ' Password is too short';
        break;
      default:
        break;
    }
    this.setState(
      {
        formErrors: fieldValidationErrors,
        emailValid: emailValid,
        passwordValid: passwordValid,
      },
      this.validateForm
    );
  }

  validateForm() {
    this.setState({
      formValid: this.state.emailValid && this.state.passwordValid,
    });
  }
  showPasword = () => {
    this.setState({
      type: !this.state.type,
    });
  };

  onSubmit = (e) => {
    e.preventDefault();
    this.setState({ loaded: false });
    API.login(this.state).then((response) => {
      this.setState({ loaded: true });
      //console.log(response)
      if (response.success === 'true') {
        localStorage.setItem('token', response.token);
        localStorage.setItem('email', response.details.recruiter_email);
        this.props.onSaveEmail(response.details.recruiter_email);
        localStorage.setItem('ID', response.details.recruiter_id);
        NotificationManager.success(response.message, 'LOGIN', 1000);
        this.setRedirect();
        this.props.ValidatingUser(true);
        // console.log('success',this.state.redirect);
      } else if (response.success === 'false') {
        NotificationManager.error(response.error);
      } else {
        //console.log("Login Error");
        NotificationManager.error('Network issue');
      }
    });
  };

  setRedirect = () => {
    this.setState({
      redirect: true,
    });
  };

  renderRedirect = () => {
    if (this.state.redirect) {
      // this.props.history.replace(`/dashboard`)
      return <Redirect to="/dashboard" />;
    }
  };

  render() {
    const { type } = this.state;
    return (
      <div>
        <Route exact path={`/dashboard`} render={(props) => <Dashboard />} />
        <Loader
          options={optionsLoad.optionsLoad}
          loaded={this.state.loaded}
        ></Loader>
        {this.renderRedirect()}
        <div className="login">
          <div className="box">
            <div className="logo">
              <img src={logo} alt="Logo" />
            </div>
            <div className="title">SIGN IN</div>

            <Form className="form" onSubmit={this.onSubmit}>
              <div className="input_fields">
                <Input
                  className={this.state.formErrors.email === '' ? '' : 'error'}
                  name="recruiter_email"
                  type="email"
                  placeholder="User Email"
                  autoComplete="on"
                  value={this.state.recruiter_email}
                  onChange={this.handleChange}
                  onBlur={this.handleChange}
                ></Input>
                <p>{this.state.formErrors.email}</p>
                <Input
                  className={
                    this.state.formErrors.password === '' ? '' : 'error'
                  }
                  id="myInput"
                  name="password"
                  type={`${type === false ? 'password' : 'text'}`}
                  placeholder="Password"
                  autoComplete="on"
                  value={this.state.password}
                  onChange={this.handleChange}
                  onBlur={this.handleChange}
                ></Input>
                <span className="showPassword">
                  <FontAwesomeIcon
                    onClick={this.showPasword}
                    icon={`${type === false ? 'eye-slash' : 'eye'}`}
                  />
                </span>
                <p> {this.state.formErrors.password}</p>
              </div>
              <Button disabled={!this.state.formValid}>LOGIN</Button>
              <div className="forgotPassword">
                <Link to="/forgotPassword">Forgot Password ?</Link>
              </div>
            </Form>
          </div>
          <NotificationContainer />
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    ctr: state.loginEmail,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSaveEmail: (data) => dispatch({ type: 'STORE_EMAIL', value: data }),
  };
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
