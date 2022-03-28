import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import CountryService from "../../services/country.service";
import jwt_decode from "jwt-decode";


class CountryList extends Component {
    constructor(props) {
        super(props);
        this.state = {
          contentError: null,
          countries: [],
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
      CountryService.getCountryList().then(
        response => {
          this.setState({countries: response.data, isLoading: false});
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
      CountryService.deleteCountry(id).then(
        response => {
          let updatedCountries = [...this.state.countries].filter(i => i.id !== id);
          this.setState({countries: updatedCountries});
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
        const {countries, isLoading, userRoles} = this.state;
    
        if (isLoading) {
          return <p>Loading...</p>;
        }

        const countriesList = countries.map(country => {
            return <tr key={country.id}>
              <td style={{whiteSpace: 'nowrap'}}>
                {country.countryName}
              </td>
              { userRoles.includes("ROLE_ADMIN") && (
                  <td>
                  <Button variant="contained" color="primary" tag={Link} to={"/country/" + country.id}
                    style={{marginRight: 10}}>
                    Edit
                  </Button>
                  <Button variant="contained" color="danger"  onClick={() => this.remove(country.id)}>
                     Delete
                  </Button>
                </td>
                )}
          
            </tr>
        });

        return (
            <div>
              <Container fluid>
                {
                  userRoles.includes("ROLE_ADMIN") && (
                    <div className="float-right">
                    <Button color="success" tag={Link} to="/country/new">Add new country</Button>
                  </div>
                )}
                <h3>Country List</h3>
                <Table className="mt-4">
                  <thead>
                    <tr>
                      <th width="40%">Name</th>
                      {
                        userRoles.includes("ROLE_ADMIN") && (
                          <th width="20%">Actions</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {countriesList}
                  </tbody>
                </Table>
              </Container>
            </div>
          );


          
    }
}

export default CountryList;
