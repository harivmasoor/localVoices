import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom'; // <-- Add this import
import './SessionForm.css';

import { login, clearSessionErrors } from '../../store/session';

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      shouldRedirect: false // <-- Add this line
    };
    this.update = this.update.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillUnmount() {
    this.props.clearSessionErrors();
  }

  update(field) {
    return e => this.setState({ [field]: e.currentTarget.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { email, password } = this.state;
    this.props.login({ email, password }).then(success => {
      if (success) {
        this.setState({ shouldRedirect: true }); // <-- Add this line
      }
    });
  }

  render() {
    // Redirect if login is successful
    if (this.state.shouldRedirect) {
      return <Redirect to="/" />; // <-- Add this line
    }

    const { errors } = this.props;
    const { email, password } = this.state;

    return (
      <form className="session-form" onSubmit={this.handleSubmit}>
        <h2>Log In Form</h2>
        <div className="errors">{errors?.email}</div>
        <label>
          <span>Email</span>
          <input
            type="text"
            value={email}
            onChange={this.update('email')}
            placeholder="Email"
          />
        </label>
        <div className="errors">{errors?.password}</div>
        <label>
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={this.update('password')}
            placeholder="Password"
          />
        </label>
        <input
          type="submit"
          value="Log In"
          disabled={!email || !password}
        />
      </form>
    );
  }
}

const mapStateToProps = (state) => ({
  errors: state.errors.session
});

const mapDispatchToProps = (dispatch) => ({
  login: (user) => dispatch(login(user)),
  clearSessionErrors: () => dispatch(clearSessionErrors())
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);




