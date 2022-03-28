import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import { connect } from "react-redux";
import jwt_decode from "jwt-decode";


class Profile extends Component {

  render() {
    const { user: currentUser } = this.props;

    if (!currentUser) {
      return <Redirect to="/login" />;
    }

    const decodeCurrentUser = jwt_decode(currentUser.accessToken);
    
    return (
      <div className="container">
        <header className="jumbotron">
          <h3>
            <strong>{decodeCurrentUser.username}</strong> Profile
          </h3>
        </header>
        <p>
          <strong>Token:</strong> {currentUser.accessToken.substring(0, 20)} ...{" "}
          {currentUser.accessToken.substr(currentUser.accessToken.length - 20)}
        </p>
        <p>
          <strong>Id:</strong> {decodeCurrentUser.jti}
        </p>
        <p>
          <strong>Email:</strong> {decodeCurrentUser.sub}
        </p>
        <strong>Authorities:</strong>
        <ul>
          {decodeCurrentUser.roles &&
            decodeCurrentUser.roles.map((role, index) => <li key={index}>{role}</li>)}
        </ul>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { user } = state.auth;
  return {
    user,
  };
}

export default connect(mapStateToProps)(Profile);