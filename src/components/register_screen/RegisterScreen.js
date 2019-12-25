import React, { Component } from 'react';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';
import { registerHandler } from '../../store/database/asynchHandler'

class RegisterScreen extends Component {
  state = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  }

  handleChange = (e) => {
    const { target } = e;

    this.setState(state => ({
      ...state,
      [target.id]: target.value,
    }));
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const { props, state } = this;
    const { firebase } = props;
    const newUser = { ...state };

    props.register(newUser, firebase);
  }

  render() {
    const { auth, authError } = this.props;
    if (auth.uid) {
      return <Redirect to="/" />;
    }

    return (
      <div className="container">
        <form onSubmit={this.handleSubmit} className="white">
          <h5 className="grey-text text-darken-3">Register</h5>
          <div className="input-field">
            <input type="email" name="email" id="email" class="validate" onChange={this.handleChange} required/>
            <label htmlFor="email" >Email</label>
            <span class="helper-text" data-error="Please enter a valid email" ></span>
          </div>
          <div className="input-field">
            <input type="password" name="password" id="password" minlength = "6" class="validate" onChange={this.handleChange} required/>
            <label htmlFor="password">Password</label>
            <span class="helper-text" data-error="Please enter 6 or more characters" ></span>

          </div>
          <div className="input-field">
            <input type="text" name="firstName" id="firstName"  minlength = "1" class="validate" onChange={this.handleChange} required/>
            <label htmlFor="firstName">First Name</label>
            <span class="helper-text" data-error="Please enter your first name" ></span>
          </div>
          <div className="input-field">
            <input type="text" name="lastName" id="lastName" minlength = "1" class="validate" onChange={this.handleChange} required/>
            <label htmlFor="lastName">Last Name</label>

            <span class="helper-text" data-error="Please enter your last name" ></span>

          </div>
          <div className="input-field">
            <button type="submit" className="btn pink lighten-1 z-depth-0">Sign Up</button>
            {authError ? <div className="red-text center"><p>{authError}</p></div> : null}
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authError: state.auth.authError,
  auth: state.firebase.auth,
});

const mapDispatchToProps = dispatch => ({
  register: (newUser, firebase) => dispatch(registerHandler(newUser, firebase)),
});

export default compose(
  firebaseConnect(),
  connect(mapStateToProps, mapDispatchToProps),
)(RegisterScreen);