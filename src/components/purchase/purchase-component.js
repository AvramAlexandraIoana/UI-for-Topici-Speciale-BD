import React, { Component } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TripService from "../../services/trip.service";
import jwt_decode from "jwt-decode";
import { Button, ButtonGroup, Container, Table , FormGroup} from 'reactstrap';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Link, withRouter } from 'react-router-dom';
import { Form} from 'reactstrap';
import UserService from "../../services/user.service";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import * as moment from 'moment'


class Purchase extends Component {


    constructor(props) {
        super(props);
        this.state = {
            trips: [],
            tripDetails: null,
            userTrips: [],
            open: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    componentDidMount() {
        if (this.props.match.params.id !== 'new') {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
            const decodeUser = jwt_decode(user.accessToken);
            this.setState({
                userRoles: decodeUser.roles
            });
            }

            console.log(user);

            this.setState({isLoading: true});
        
            TripService.getTripList().then(
                response => {
                    this.setState({trips: response.data, isLoading: false});
                    let tripList = [ ...this.state.trips];
                    for (let i = 0; i < tripList.length; i++) {
                        tripList[i].checked = false;
                    }
                    this.setState({trips: tripList});
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
                    this.setState({userTrips: response.data.trips, isLoading: false});
                    let tripList = [ ...this.state.trips];
                    let userTrips = [ ...this.state.userTrips];
                    console.log(tripList);
                    for (let i = 0; i < userTrips.length; i++) {
                        let findTripIndex = tripList.findIndex((trip) => {
                            return trip.id === userTrips[i].id;
                        });
                        console.log(findTripIndex);
                        if (findTripIndex != -1) {
                            tripList[findTripIndex].checked = true;
                            document.getElementById(findTripIndex).click();
                        }

                    }

                    this.setState({trips: tripList});

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
        let updatedTrips = [...this.state.trips];
        updatedTrips[index].checked = event.target.checked;
        console.log(updatedTrips);
        this.setState({trips: updatedTrips});
    }

    // Submit
    handleSubmit = (e) => {
        e.preventDefault();
        console.log(this.state);
        let sendObject = {
            id: parseFloat(this.props.match.params.id),
            tripIds: []
        };

        for (let i = 0; i < this.state.trips.length; i++) {
            if (this.state.trips[i].checked) {
                sendObject.tripIds.push(this.state.trips[i].id);
            }
        }
        UserService.addUserTrip(sendObject.id, sendObject).then(
            response => {
                this.props.history.push('/usertrip/list/' + this.props.match.params.id);
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

    handleClickOpen(event) {
       const index = event.target.name;
       TripService.getTrip(parseFloat(index)).then(
        response => {
          this.setState({tripDetails: response.data});
          console.log(this.state);
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
       this.setState({open: true});
       console.log(this.state);
    }

    handleClose()  {
        this.setState({open: false});
        console.log(this.state);
    }


    render() {
        const {trips, open, tripDetails} = this.state;
        const tripList = trips.map((trip, key) => {
            return (
                <FormGroup>
                    <FormControlLabel
                        className="trip-line"
                        control={
                        <Checkbox
                            checked={trip.checked}
                            onChange={this.handleChange}
                            name={key}
                            id={key}
                            color="primary"
                        />
                        }
                        label={trip.name}
                    />
                    <Button name={trip.id} variant="outlined" color="primary" onClick={this.handleClickOpen}>
                        View trip details
                    </Button>
                </FormGroup>
                
                )
        });
        return (
            <Container>
                <h3>Buy a trip</h3>
                <Form onSubmit={this.handleSubmit}>
                    {tripList}
                    <FormGroup>
                        <Button color="primary" type="submit">Save</Button>{' '}
                        <Button color="secondary" tag={Link} to="/country/list">Cancel</Button>
                    </FormGroup>
                </Form>
                <Dialog
                    open={open}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Trip Details"}</DialogTitle>
                    <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <Card style={{minWidth: 275 }} variant="outlined">
                            <CardContent>
                                <Typography style={{fontSize: 14 }} variant="h5" component="h2">
                                    <b>
                                        Name:
                                    </b>
                                    {tripDetails ? tripDetails.name : ''}
                                </Typography>
                                <Typography style={{fontSize: 14 }} variant="h5" component="h2">
                                    <b>
                                        Number of Seats:
                                    </b>
                                    {tripDetails ? tripDetails.numberOfSeats : ''}
                                </Typography>
                                <Typography style={{fontSize: 14 }} variant="h5" component="h2">
                                    <b>
                                        Price:
                                    </b>
                                    {tripDetails ? tripDetails.price : ''}
                                </Typography>
                                <Typography style={{fontSize: 14 }} variant="h5" component="h2">
                                    <b>
                                        Duration:
                                    </b>
                                    {tripDetails ? tripDetails.duration : ''}
                                </Typography>
                                <Typography style={{fontSize: 14 }} variant="h5" component="h2">
                                    <b>
                                        Start Date:
                                    </b>
                                    {tripDetails ? moment(tripDetails.startDate).format('DD/MM/YYYY') : ''}
                                </Typography>
                                <Typography style={{fontSize: 14 }} variant="h5" component="h2">
                                    <b>
                                        End Date:
                                    </b>
                                    {tripDetails ? moment(tripDetails.endDate).format('DD/MM/YYYY') : ''}
                                </Typography>
                                <Typography style={{fontSize: 14 }} variant="h5" component="h2">
                                    <b>
                                        Location:
                                    </b>
                                    {tripDetails && tripDetails.location ? tripDetails.city : ''}
                                </Typography>
                                <Typography style={{fontSize: 14 }} variant="h5" component="h2">
                                    <b>
                                        Agency:
                                    </b>
                                    {tripDetails && tripDetails.agency ? tripDetails.agency.name : ''}
                                </Typography>
                              
                            </CardContent>
                        </Card>
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={this.handleClose} color="primary" autoFocus>
                        Close
                    </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        );
    }
}

export default Purchase;