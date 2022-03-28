import React, { Component } from "react";
import { connect } from "react-redux";
import { Router, Switch, Route, Link } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Login from "./components/login.component";
import Register from "./components/register.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import BoardUser from "./components/board-user.component";

import { logout } from "./actions/auth";
import { clearMessage } from "./actions/message";

import { history } from './helpers/history';
import jwt_decode from "jwt-decode";
import CountryList from "./components/country/country-list.component";
import CountryEdit from "./components/country/country-edit.component";
import LocationList from "./components/location/location-list.component";
import LocationEdit from "./components/location/location-edit.component";
import AgencyList from "./components/agency/agency-list.component";
import AgencyEdit from "./components/agency/agency-edit.component";
import TripList from "./components/trip/trip-list.component";
import TripEdit from "./components/trip/trip-edit.component";
import InfoEdit from "./components/info/info-edit.component";
import InfoShow from "./components/info/info-show.component";
import UserListAdmin from "./components/user-list-admin/user-list-admin.component";
import Purchase from "./components/purchase/purchase-component";
import UserTripList from "./components/user-trip/user-trip-list.component";
import UserRoles from "./components/user-edit/user-roles.component";
import LocationListPagination from "./components/location/location-list-pagination.component";


class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      id: null,
      showModeratorBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
    };

    history.listen((location) => {
      props.dispatch(clearMessage()); // clear message when changing location
    });
  }

  componentDidMount() {
    const user = this.props.user;

    if (user) {
      const decodeUser  = jwt_decode(user.accessToken);
      this.setState({
        id: decodeUser.jti,
        currentUser: decodeUser,
        showAdminBoard: decodeUser.roles.includes("ROLE_ADMIN")
      });
    }
  }

  logOut() {
    this.props.dispatch(logout());
  }

  render() {
    const { id, currentUser, showModeratorBoard, showAdminBoard } = this.state;

    return (
      <Router history={history}>
        <div>
          <nav className="navbar navbar-expand navbar-dark bg-dark">
            <Link to={"/"} className="navbar-brand">
              Travel App
            </Link>
            <div className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link to={"/trip/list"} className="nav-link">
                  Trip List
                </Link>
              </li>

              {showModeratorBoard && (
                <li className="nav-item">
                  <Link to={"/mod"} className="nav-link">
                    Moderator Board
                  </Link>
                </li>
              )}

              {showAdminBoard && (
                <li className="nav-item">
                  <Link to={"/admin"} className="nav-link">
                    Admin Board
                  </Link>
                </li>
              )}

  	          {currentUser && (
                <li className="nav-item">
                  <Link to={"/country/list"} className="nav-link">
                    Country List
                  </Link>
                </li>
              )}

              {currentUser && (
                <li className="nav-item">
                  <Link to={"/location/list"} className="nav-link">
                    Location List
                  </Link>
                </li>
              )}

              {currentUser && (
                <li className="nav-item">
                  <Link to={"/locations/pagination"} className="nav-link">
                    Pagination 
                  </Link>
                </li>
              )}

              {currentUser && (
                <li className="nav-item">
                  <Link to={"/agency/list"} className="nav-link">
                    Agency List
                  </Link>
                </li>
              )}

              {currentUser && (
                <li className="nav-item">
                  <Link to={"/trip/list"} className="nav-link">
                    Trip List
                  </Link>
                </li>
              )}

        

              {currentUser && (
                <li className="nav-item">
                  <Link to={"/purchase/" + id} className="nav-link">
                    Purchase A Trip
                  </Link>
                </li>
              )}

              {currentUser && (
                <li className="nav-item">
                  <Link to={"/usertrip/list/" + id} className="nav-link">
                    View Your Trip List
                  </Link>
                </li>
              )}
            </div>

            {currentUser ? (
              <div className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link to={"/profile"} className="nav-link">
                    {currentUser.username}
                  </Link>
                </li>
                <li className="nav-item">
                  <a href="/login" className="nav-link" onClick={this.logOut}>
                    LogOut
                  </a>
                </li>
              </div>
            ) : (
              <div className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link to={"/login"} className="nav-link">
                    Login
                  </Link>
                </li>

                <li className="nav-item">
                  <Link to={"/register"} className="nav-link">
                    Sign Up
                  </Link>
                </li>
              </div>
            )}
          </nav>

          <div className="container mt-3">
            <Switch>
              <Route exact path={["/", "/home"]} component={Home} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/profile" component={Profile} />
              <Route path="/user" component={BoardUser} />
              <Route path="/admin" component={UserListAdmin} />
              <Route path="/country/list" component={CountryList} />
              <Route path="/country/:id" component={CountryEdit} />
              <Route path="/location/list" component={LocationList} />
              <Route path="/location/:id" component={LocationEdit} />
              <Route path="/agency/list" component={AgencyList} />
              <Route path="/agency/:id" component={AgencyEdit} />
              <Route path="/trip/list" component={TripList} />
              <Route path="/trip/:id" component={TripEdit} />
              <Route path="/info/:id" component={InfoEdit} />
              <Route path="/list/location/info/:id" component={InfoShow} />
              <Route path="/purchase/:id" component={Purchase} />
              <Route path="/usertrip/list/:id" component={UserTripList} />
              <Route path="/roles/:id" component={UserRoles} />
              <Route path="/locations/pagination" component={LocationListPagination} />

            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

function mapStateToProps(state) {
  const { user } = state.auth;
  return {
    user,
  };
}

export default connect(mapStateToProps)(App);