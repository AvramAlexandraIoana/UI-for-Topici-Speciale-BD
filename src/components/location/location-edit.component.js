import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CountryService from '../../services/country.service';
import LocationService from '../../services/location.service';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


class LocationEdit extends Component {

  emptyItem = {
    city: null,
    streetAddress: null,
    country: null
  };

  constructor(props) {
    super(props);
    this.state = {
      item: this.emptyItem,
      countryList: [],
      contentError: null
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    if (this.props.match.params.id !== 'new') {
      LocationService.getLocation(this.props.match.params.id).then(
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

    CountryService.getCountryList().then(
      response => {
        this.setState({countryList: response.data});
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

  setCountry(value) {
    let item = { ...this.state.item};
    item.country = value;
    this.setState({item});
  }

  async handleSubmit(event) {
    event.preventDefault();
    const {item} = this.state;
    if (!item.id) {
      LocationService.createNewLocationAdmin(item).then(
        response => {
          this.props.history.push('/location/list');
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
      LocationService.updateLocationAdmin(item).then(
        response => {
          this.props.history.push('/location/list');
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

  render() {
    const {item} = this.state;
    const title = <h2>{item.id ? 'Edit Location' : 'Add Location'}</h2>;
    const countryList = this.state.countryList;
    return <div>
      <Container>
        {title}
        <Form onSubmit={this.handleSubmit}>
           <FormGroup>
                <TextField
                        id="outlined-full-width"
                        label="City"
                        placeholder="City"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        name="city" 
                        id="city" 
                        value={item.city || ''}
                        onChange={this.handleChange}
                />
            </FormGroup>
            <FormGroup>
                <TextField
                        id="outlined-full-width"
                        label="Street Address"
                        placeholder="Street Address"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        name="streetAddress" 
                        id="streetAddress" 
                        value={item.streetAddress || ''}
                        onChange={this.handleChange}
                />
            </FormGroup>
            <FormGroup>
                <Autocomplete
                    value={item.country || '' }
                    options={countryList}
                    getOptionLabel={(option) => option.countryName}
                    fullWidth
                    onChange={(event, value) =>  this.setCountry(value)}
                    renderInput={(params) => <TextField {...params}  
                                label="Country" variant="outlined" />}
                />
            </FormGroup>
           
            <FormGroup>
                <Button color="primary" type="submit">Save</Button>{' '}
                <Button color="secondary" tag={Link} to="/country/list">Cancel</Button>
            </FormGroup>
        </Form>
      </Container>
      <ToastContainer />          
    </div>
  }
}

export default withRouter(LocationEdit);