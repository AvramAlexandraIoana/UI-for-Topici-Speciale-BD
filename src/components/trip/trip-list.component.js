import { Component } from "react";
import TripService from "../../services/trip.service";
import jwt_decode from "jwt-decode";
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import * as moment from 'moment'


class TripList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            trips: [],
            isLoading: true,
            contentError: '',
            userRoles: []
        };
        this.remove = this.remove.bind(this);
        this.sortDescendingByPrice = this.sortDescendingByPrice.bind(this);
    }

    componentDidMount() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
          const decodeUser = jwt_decode(user.accessToken);
          this.setState({
            userRoles: decodeUser.roles,
            userId: parseFloat(decodeUser.jti)

          });
        }

        console.log(user);

        this.setState({isLoading: true});
    
        TripService.getTripList().then(
            response => {
                this.setState({trips: response.data, isLoading: false});
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
        TripService.deleteTrip(id).then(
            response => {
                let updatedTrips = [...this.state.trips].filter(i => i.id !== id);
                this.setState({trips: updatedTrips});
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

    async sortDescendingByPrice() {
        TripService.findPageSortingByPriceDescending(1, this.state.trips.length).then(
            response => {
                this.setState({trips: response.data});
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
        const {trips, isLoading, userRoles,userId} = this.state;
    
        if (isLoading) {
          return <p>Loading...</p>;
        }

        const tripList = trips.map(trip => {
            return <tr key={trip.id}>
                <td style={{whiteSpace: 'nowrap'}}>
                  {trip.name}
                </td>
                <td style={{whiteSpace: 'nowrap'}}>
                    {trip.numberOfSeats}
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
                {
                   userId == trip.userId &&   (userRoles.includes('ROLE_ADMIN') || userRoles.includes('ROLE_MANAGER')) &&
                    (
                        <td>
                            <Button variant="contained" color="primary" tag={Link} to={"/trip/" + trip.id}
                                style={{marginRight: 10}}>
                                Edit
                            </Button>
                            <Button variant="contained" color="danger"  onClick={() => this.remove(trip.id)}
                                style={{marginRight: 10}}>
                                Delete
                            </Button>
                        </td>
                    )
                } 
            </tr>
        });
        return <div>
                <Container fluid>
                    {
                        (userRoles.includes('ROLE_ADMIN') || userRoles.includes('ROLE_MANAGER')) &&
                        (
                            <div  className="float-right">
                                <Button color="success" tag={Link} to="/trip/new">Add new trip</Button>
                            </div>
                        )
                    }
                        {
                        (userRoles.includes('ROLE_USER')) &&
                        (
                            <div  className="float-right">
                                <Button color="info" style={{marginRight: 10}} 
                                    onClick={() => this.sortDescendingByPrice()}>Sort descending by price</Button>
                            </div>
                        )
                    }
                    <h3>Trip List</h3>
                    <Table className="mt-4">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Number of Seats</th>
                                <th>Price</th>
                                <th>Duration</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Agency Name</th>
                                <th>Location</th>
                                { (userRoles.includes('ROLE_ADMIN') || userRoles.includes('ROLE_MANAGER')) &&
                                    (<th>Actions</th>)
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {tripList}
                        </tbody>
                    </Table>
                </Container>
            </div>
    }
}

export default TripList;