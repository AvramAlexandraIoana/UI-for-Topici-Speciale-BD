import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import CountryService from "../../services/country.service";
import TextField from '@material-ui/core/TextField';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

class CountryEdit extends Component {

  emptyItem = {
    countryName: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      item: this.emptyItem,
      contentError: null
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    if (this.props.match.params.id !== 'new') {
      CountryService.getCountryAdmin(this.props.match.params.id).then(
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
      );

    }
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
    if (item.id) {
      CountryService.updateCountryAdmin(item).then(
        response => {
          this.props.history.push('/country/list');
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
      );
    } else {
      CountryService.createNewCountryAdmin(item).then(
        response => {
          this.props.history.push('/country/list');
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
      );
    }


  }

  render() {
    const {item} = this.state;
    const title = <h2>{item.id ? 'Edit Country' : 'Add Country'}</h2>;

    return <div>
      <Container>
        {title}
        <Form onSubmit={this.handleSubmit}>
            <FormGroup>
              <TextField
                      id="outlined-full-width"
                      label="Country Name"
                      placeholder="Country Name"
                      fullWidth
                      margin="normal"
                      InputLabelProps={{
                          shrink: true,
                      }}
                      variant="outlined"
                      name="countryName" 
                      id="countryName" 
                      value={item.countryName || ''}
                      onChange={this.handleChange}
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

export default withRouter(CountryEdit);