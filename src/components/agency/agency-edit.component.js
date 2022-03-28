import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import LocationService from '../../services/location.service';
import AgencyService from '../../services/agency.service';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


class AgencyEdit extends Component {
    emptyItem = {
        name: null,
        location: null
    };
    
    constructor(props) {
        super(props);
        this.state = {
            item: this.emptyItem,
            locationList: [],
            contentError: null
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount() {
        if (this.props.match.params.id !== 'new') {
            AgencyService.getAgency(this.props.match.params.id).then(
                response => {
                  this.setState({item: response.data});
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
        console.log(this.state);

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
            AgencyService.createNewAgency(item).then(
              response => {
                this.props.history.push('/agency/list');
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
            AgencyService.updateAgency(item).then(
                response => {
                  this.props.history.push('/agency/list');
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
    

    render() {
        const {item} = this.state;
        const locationList = this.state.locationList;
        const title = <h2>{item.id ? 'Edit Agency' : 'Add Agency'}</h2>;
    
        return <div>
          <Container>
            {title}
            <Form onSubmit={this.handleSubmit}>
                <FormGroup>
                    <TextField
                            id="outlined-full-width"
                            label="Agency Name"
                            placeholder="Agency Name"
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
                    <Autocomplete
                        value={item.location || '' }
                        options={locationList}
                        getOptionLabel={(option) => option.city}
                        fullWidth
                        onChange={(event, value) =>  this.setLocation(value)}
                        renderInput={(params) => <TextField {...params} 
                                    label="Location" variant="outlined" placeholder="Location" />}
                    />
                </FormGroup>
                <FormGroup>
                    <Button color="primary" type="submit">Save</Button>{' '}
                    <Button color="secondary" tag={Link} to="/agency/list">Cancel</Button>
                </FormGroup>
            </Form>
          </Container>
          <ToastContainer />          
        </div>

      }
}

export default withRouter(AgencyEdit);