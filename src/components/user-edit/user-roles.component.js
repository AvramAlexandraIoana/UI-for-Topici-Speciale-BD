import { Component } from "react";
import jwt_decode from "jwt-decode";
import UserService from "../../services/user.service";
import RoleService from "../../services/role.service";
import { Button, ButtonGroup, Container, Table , FormGroup} from 'reactstrap';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Link, withRouter } from 'react-router-dom';
import { Form} from 'reactstrap';

class UserRoles extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUserRoles: [],
            userRoles: [],
            userRolesL: []
            
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        if (this.props.match.params.id !== 'new') {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
            const decodeUser = jwt_decode(user.accessToken);
            this.setState({
                currentUserRoles: decodeUser.roles
            });
            }

            console.log(user);
            RoleService.getRoleList().then(
                response => {
                    this.setState({userRoles: response.data, isLoading: false});
                    let userRolesList = [ ...this.state.userRoles];
                    for (let i = 0; i < userRolesList.length; i++) {
                        userRolesList[i].checked = false;
                    }
                    this.setState({userRoles: userRolesList});
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

            UserService.getUserById(parseFloat(this.props.match.params.id)).then(
                response => {
                    this.setState({userRolesL: response.data.roles, isLoading: false});
                    let userRoles = [ ...this.state.userRoles];
                    let userRolesL = [ ...this.state.userRolesL];
                    console.log(userRoles);
                    for (let i = 0; i < userRolesL.length; i++) {
                        let findRoleIndex = userRoles.findIndex((role) => {
                            return role.id === userRolesL[i].id;
                        });
                        console.log(findRoleIndex);
                        if (findRoleIndex != -1) {
                            userRoles[findRoleIndex].checked = true;
                            document.getElementById(findRoleIndex).click();
                        }

                    }

                    this.setState({userRoles: userRoles});

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
    }

    handleChange(event) {
        const index = event.target.name;
        let updatedUserRoles = [...this.state.userRoles];
        updatedUserRoles[index].checked = event.target.checked;
        console.log(updatedUserRoles);
        this.setState({userRoles: updatedUserRoles});
    }

    // Submit
    handleSubmit = (e) => {
        e.preventDefault();
        console.log(this.state);
        let sendObject = {
            id: parseFloat(this.props.match.params.id),
            roleIds: []
        };

        for (let i = 0; i < this.state.userRoles.length; i++) {
            if (this.state.userRoles[i].checked) {
                sendObject.roleIds.push(this.state.userRoles[i].id);
            }
        }
        UserService.updateRoles(sendObject.id, sendObject).then(
            response => {
                this.props.history.push('/admin');
            },
            error => {
              this.setState({
                content:
                  (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                  error.message ||
                  error.toString()
              });
            }
        );
    }

    render() {
        const {userRoles} = this.state;
        const userRolesList = userRoles.map((role, key) => {
            return (
                <FormGroup>
                    <FormControlLabel
                        className="role-line"
                        control={
                        <Checkbox
                            checked={role.checked}
                            onChange={this.handleChange}
                            name={key}
                            id={key}
                            color="primary"
                        />
                        }
                        label={role.name}
                    />
                </FormGroup>
                
                )
        });
        return (
            <Container>
                <h3>Set User Roles</h3>
                <Form onSubmit={this.handleSubmit}>
                    {userRolesList}
                    <FormGroup>
                        <Button color="primary" type="submit">Save</Button>{' '}
                        <Button color="secondary" tag={Link} to="/admin">Cancel</Button>
                    </FormGroup>
                </Form>
            </Container>
        )
       
    }

}


export default UserRoles;