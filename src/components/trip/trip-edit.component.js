import { Component } from "react";
import AgencyService from "../../services/agency.service";
import TripService from "../../services/trip.service";
import { Link, withRouter } from 'react-router-dom';
import LocationService from "../../services/location.service";
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import * as moment from 'moment'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



class TripEdit extends Component {
    emptyItem = {
        name: null,
        numberOfSeats: null,
        price: null,
        duration: null,
        startDate: null,
        endDate: null,
        location: null,
        agency: null
    }

    constructor(props) {
        super(props);
        this.state = {
            item: this.emptyItem,
            agencyList: [],
            locationList: []
        };
       this.handleChange = this.handleChange.bind(this);
       this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount() {
        if (this.props.match.params.id !== 'new') {
          TripService.getTrip(this.props.match.params.id).then(
            response => {
              //this.setState({item: response.data});
              const {item} = this.state;
              item.name = response.data.name;
              item.numberOfSpots = response.data.numberOfSpots;
              item.price = response.data.price;
              item.startDate =  moment(response.data.startDate).toDate();
              item.endDate =  moment(response.data.endDate).toDate();
              item.location = response.data.location;
              item.agency = response.data.agency;
              item.numberOfSeats = response.data.numberOfSeats;
              item.duration = response.data.duration;
              item.id = response.data.id;
              console.log(item);

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

        LocationService.getLocationList().then(
            response => {
                this.setState({locationList: response.data});
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
        AgencyService.getAgencyList().then(
            response => {
                this.setState({agencyList: response.data});
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

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let item = {...this.state.item};
        item[name] = value;
        this.setState({item});
    }

    async handleSubmit(event) {
        event.preventDefault();
        const {item} = this.state;
        if (!item.id) {
            TripService.createNewTrip(item).then(
                response => {
                this.props.history.push('/trip/list');
                },
                error => {
                    if (error.response.data) {
                        let {contentError} = this.state;
                        contentError = '';
                        error.response.data.errors.map(err=> {
                          contentError += err.message + ' ';
                        });
                        this.setState({contentError});
                        toast.error(contentError);
                    }
                }
            )
        } else {
            TripService.updateTrip(item).then(
                response => {
                this.props.history.push('/trip/list');
                },
                error => {
                    if (error.response.data) {
                        let {contentError} = this.state;
                        contentError = '';
                        error.response.data.errors.map(err=> {
                          contentError += err.message + ' ';
                        });
                        this.setState({contentError});
                        toast.error(contentError);
                    }
                }
          )
        }
    }

    setLocation(value) {
        let item = { ...this.state.item};
        item.location = value;
        this.setState({item});
    }

    setAgency(value) {
        let item = { ...this.state.item};
        item.agency = value;
        this.setState({item});
    }

    setStartDate(value) {
        let item = { ...this.state.item};
        item.startDate = value;
        this.setState({item});  
    }

    setEndDate(value) {
        let item = { ...this.state.item};
        item.endDate = value;
        this.setState({item});
    }

    render() {
        const {item} = this.state;
        const title = <h2>{item.id ? 'Edit Trip' : 'Add Trip'}</h2>;
        const locationList = this.state.locationList;
        const agencyList = this.state.agencyList;
        return <div>
          <Container>
            {title}
            <Form onSubmit={this.handleSubmit}>
                <FormGroup>
                        <TextField
                            id="outlined-full-width"
                            label="Name"
                            placeholder="Name"
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            name="name" 
                            id="name" 
                            value={item.name || ''}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <TextField
                            type="number"
                            id="outlined-full-width"
                            label="Number of Seats"
                            placeholder="Number of Seats"
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            name="numberOfSeats" 
                            id="numberOfSeats" 
                            value={item.numberOfSeats || ''}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <TextField
                            type="number"
                            id="outlined-full-width"
                            label="Price"
                            placeholder="Price"
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            name="price" 
                            id="price" 
                            value={item.price || ''}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <TextField
                            type="number"
                            id="outlined-full-width"
                            label="Duration"
                            placeholder="Duration"
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            name="duration" 
                            id="duration" 
                            value={item.duration || ''}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Autocomplete
                            value={item.location}
                            options={locationList}
                            getOptionLabel={(option) => option.city}
                            fullWidth
                            onChange={(event, value) =>  this.setLocation(value)}
                            renderInput={(params) => <TextField {...params} 
                                        label="Location" variant="outlined" />}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Autocomplete
                            value={item.agency}
                            options={agencyList}
                            getOptionLabel={(option) => option.name}
                            fullWidth
                            onChange={(event, value) =>  this.setAgency(value)}
                            renderInput={(params) => <TextField {...params} 
                                        label="Agency" variant="outlined" />}
                        />
                    </FormGroup>
                    <FormGroup>
                        <DatePicker 
                            className="inputStyles"
                            name="startDate" 
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Start Date"
                            selected={item.startDate} 
                            onChange={date => this.setStartDate(date)} />
                    </FormGroup>
                    <FormGroup>
                        <DatePicker 
                            name="endDate" 
                            dateFormat="dd/MM/yyyy"
                            className="inputStyles"
                            placeholderText="End Date"
                            selected={item.endDate} 
                            onChange={date => this.setEndDate(date)} />
                    </FormGroup>
                    <FormGroup>
                        <Button color="primary" type="submit">Save</Button>{' '}
                        <Button color="secondary" tag={Link} to="/trip/list">Cancel</Button>
                    </FormGroup>
                </Form>
            </Container>
            <ToastContainer />          
        </div>
    }
}



export default withRouter(TripEdit);