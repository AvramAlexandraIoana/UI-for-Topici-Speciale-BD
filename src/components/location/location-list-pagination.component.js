import React, { Component } from 'react';

import Pagination from './pagination-component';
import LocationCard from  './location-card-component';
import CountryService from "../../services/country.service";
import jwt_decode from "jwt-decode";
import LocationService from '../../services/location.service';


class LocationListPagination extends Component {

  state = { allLocations: [],
        currentLocations: [], 
        currentPage: null, totalPages: null }

  componentDidMount() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      const decodeUser  = jwt_decode(user.accessToken);
      this.setState({
        userRoles: decodeUser.roles
      });
    }

    console.log(user);

    LocationService.getLocationList().then(
      response => {
          this.setState({allLocations: response.data, isLoading: false});
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

  onPageChanged = data => {
    const { allLocations } = this.state;
    const { currentPage, totalPages, pageLimit } = data;

    LocationService.findPage(currentPage).then(
      response => {
        console.log(this.state);
        this.setState({ currentPage, currentLocations: response.data, totalPages });
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
    )

  }

  render() {
    const { allLocations, currentLocations, currentPage, totalPages } = this.state;
    const totalLocations = allLocations.length;

    if (totalLocations === 0) return null;

    const headerClass = ['text-dark py-2 pr-4 m-0', currentPage ? 'border-gray border-right' : ''].join(' ').trim();

    return (
      <div className="container mb-5">
        <div className="row d-flex flex-row py-5">

          <div className="w-100 px-4 py-5 d-flex flex-row flex-wrap align-items-center justify-content-between">
            <div className="d-flex flex-row align-items-center">

              <h2 className={headerClass}>
                <strong className="text-secondary">{totalLocations}</strong> Locations
              </h2>

              { currentPage && (
                <span className="current-page d-inline-block h-100 pl-4 text-secondary">
                  Page <span className="font-weight-bold">{ currentPage }</span> / <span className="font-weight-bold">{ totalPages }</span>
                </span>
              ) }

            </div>

            <div className="d-flex flex-row py-4 align-items-center">
              <Pagination totalRecords={totalLocations} pageLimit={4} pageNeighbours={1} onPageChanged={this.onPageChanged} />
            </div>
          </div>

          { currentLocations.map(location => <LocationCard key={location.id} location={location} />) }

        </div>
      </div>
    );
  }

}

export default LocationListPagination;