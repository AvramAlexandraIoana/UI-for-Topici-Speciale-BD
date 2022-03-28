
import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import LocationService from '../../services/location.service';

class LocationList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contentError: null,
            locations: [],
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
    
        LocationService.getLocationList().then(
            response => {
                this.setState({locations: response.data, isLoading: false});
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

    async remove(id) {
        LocationService.deleteLocation(id).then(
            response => {
                let updatedLocations = [...this.state.locations].filter(i => i.id !== id);
                this.setState({locations: updatedLocations});
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

        const {locations, isLoading, userRoles} = this.state;
    
        if (isLoading) {
          return <p>Loading...</p>;
        }

        const locationList = locations.map(location => {
            return <tr key={location.id}>
                <td style={{whiteSpace: 'nowrap'}}>
                  {location.city}
                </td>
                <td style={{whiteSpace: 'nowrap'}}>
                    {location.streetAddress}
                </td>
                { userRoles.includes("ROLE_ADMIN") && (
                    <td>
                        <Button variant="contained" color="primary" tag={Link} to={"/location/" + location.id}
                            style={{marginRight: 10}}>
                            Edit
                        </Button>
                        <Button variant="contained" color="danger"  onClick={() => this.remove(location.id)}
                            style={{marginRight: 10}}>
                            Delete
                        </Button>
                        <Button variant="info" color="info"  tag={Link} to={"/info/" + location.id}>
                           Add Location Info
                        </Button>
                    </td>
                )}
                {( userRoles.includes("ROLE_USER")  && location.info && location.info.id )&& (
                    <td>
                        <Button variant="info" color="info"  tag={Link} to={"/list/location/info/" + location.id}>
                           View Location Info
                        </Button>
                    </td>
                )}
            </tr>
        });

    
        return <div>
            <Container fluid>
                <div  className="float-right">
                    {userRoles.includes("ROLE_ADMIN") && (
                        <Button color="success" tag={Link} to="/location/new">Add new location</Button>
                    )}
                </div>
                <h3>Location List</h3>
                <Table className="mt-4">
                    <thead>
                        <tr>
                            <th>City</th>
                            <th>Streed Address</th>
                            { userRoles.includes("ROLE_ADMIN") && (
                                <th>Actions</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {locationList}
                    </tbody>
                </Table>
            </Container>
        </div>
      }

}


export default LocationList;