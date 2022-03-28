import React, { Component } from "react";
import jwt_decode from "jwt-decode";
import UserService from "../../services/user.service";
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import * as moment from 'moment'


class UserTripList extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          contentError: "",
          userTripList: [],
          userRoles: [],
          isLoading: false
        };

        this.remove = this.remove.bind(this);

        
    }

    async componentDidMount() {
        if (this.props.match.params.id !== 'new') {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
            const decodeUser  = jwt_decode(user.accessToken);
            this.setState({
                userRoles: decodeUser.roles
            });
            }
        
            console.log(user);
            this.setState({isLoading: true});
        
            UserService.getUserById(parseFloat(this.props.match.params.id)).then(
            response => {
                this.setState({userTripList: response.data.trips, isLoading: false});
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
    }

    async remove(id) {
        let sendObject = {
            id: parseFloat(this.props.match.params.id),
            tripIds: []
        };

        for (let i = 0; i < this.state.userTripList.length; i++) {
            if (this.state.userTripList[i].id != id) {
                sendObject.tripIds.push(this.state.userTripList[i].id);
            }
        }
        UserService.addUserTrip(sendObject.id, sendObject).then(
            response => {
                let updatedUserTripList = [...this.state.userTripList].filter(i => i.id !== id);
                this.setState({userTripList: updatedUserTripList});
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
        const {userTripList, isLoading, userRoles} = this.state;
    
        if (isLoading) {
          return <p>Loading...</p>;
        }
    
        const userTrips = userTripList.map(trip => {
          return <tr key={trip.id}>
                <td style={{whiteSpace: 'nowrap'}}>
                    {trip.name}
                </td>
                <td style={{whiteSpace: 'nowrap'}}>
                    {trip.price}
                </td>
                <td style={{whiteSpace: 'nowrap'}}>
                    {trip.duration} Days
                </td>
                <td style={{whiteSpace: 'nowrap'}}>
                    {moment(trip.startDate).format('DD/MM/YYYY')}
                </td>
                <td style={{whiteSpace: 'nowrap'}}>
                    {moment(trip.endDate).format('DD/MM/YYYY')}
                </td>
                <td style={{whiteSpace: 'nowrap'}}>
                    {trip.agency ? trip.agency.name : ''}
                </td>
                <td style={{whiteSpace: 'nowrap'}}>
                    {trip.location ? trip.location.city : ''}
                </td>
                <td>
                    <Button variant="contained" color="danger"  onClick={() => this.remove(trip.id)}
                        style={{marginRight: 10}}>
                        Delete
                    </Button>
                </td>
              
          </tr>
        });
    
        return <div>
          <Container fluid>
              <h3>User Trip List</h3>
              <Table className="mt-4">
                  <thead>
                      <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Duration</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Location</th>
                        <th>Agency</th>
                        <th>Actions</th>
                      </tr>
                  </thead>
                  <tbody>
                    {userTrips}
                  </tbody>
              </Table>
          </Container>
      </div>
    }

}

export default UserTripList;