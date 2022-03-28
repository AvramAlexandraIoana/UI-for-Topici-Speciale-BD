import React, { Component } from "react";
import jwt_decode from "jwt-decode";
import UserService from "../../services/user.service";
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import { Link } from 'react-router-dom';

export default class UserListAdmin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      contentError: "",
      userList: [],
      isLoading: true,
      userRoles: []
    };

    this.remove = this.remove.bind(this);

  }

  componentDidMount() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      const decodeUser  = jwt_decode(user.accessToken);
      this.setState({
        userRoles: decodeUser.roles
      });
    }

    console.log(user);
    this.setState({isLoading: true});

    UserService.getUserList().then(
      response => {
        this.setState({userList: response.data, isLoading: false});
      },
      error => {
        this.setState({
          contentError:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        });
      }
    );
  }

  async remove(id) {
    UserService.deleteUser(id).then(
        response => {
            let updatedUsers = [...this.state.userList].filter(i => i.id !== id);
            this.setState({userList: updatedUsers});
        },
        error => {
            this.setState({
                contentError:
                  (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                  error.message ||
                  error.toString()
            });
        }
    )
  }

  render() {
    const {userList, isLoading, userRoles} = this.state;
    
    if (isLoading) {
      return <p>Loading...</p>;
    }

    const users = userList.map(user => {
      return <tr key={user.id}>
          <td style={{whiteSpace: 'nowrap'}}>
            {user.name}
          </td>
          <td style={{whiteSpace: 'nowrap'}}>
            {user.username}
          </td>
          <td style={{whiteSpace: 'nowrap'}}>
            {user.email}
          </td>
          <td style={{whiteSpace: 'nowrap'}}>
            {user.roles && user.roles.map((role, key2) =>
              role.name +
              (key2 < user.roles.length - 1 ? ', ': '')
            )}
          </td>
          { userRoles.includes("ROLE_ADMIN") && (
              <td>
                 <Button variant="contained" color="info"  tag={Link} to={"/roles/" + user.id}
                    style={{marginRight: 10}}>
                    Edit user roles
                  </Button>
                  <Button variant="contained" color="danger"  onClick={() => this.remove(user.id)}
                      style={{marginRight: 10}}>
                      Delete
                  </Button>
              </td>
          )}
      </tr>
    });

    return <div>
          <Container fluid>
              <h3>User List</h3>
              <Table className="mt-4">
                  <thead>
                      <tr>
                          <th>Name</th>
                          <th>Username</th>
                          <th>Email</th>
                          <th>Roles</th>
                          { userRoles.includes("ROLE_ADMIN") && (
                              <th>Actions</th>
                          )}
                      </tr>
                  </thead>
                  <tbody>
                      {users}
                  </tbody>
              </Table>
          </Container>
      </div>
  }
}