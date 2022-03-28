import React from 'react';
import PropTypes from 'prop-types';
import Flag from 'react-flags';
import Img from 'react-bootstrap/Image'

const SERVE_URL = 'http://localhost:8080/api/info/location/getImage/';

const LocationCard = props => {
  const { id = null,  streetAddress =  null, city = null, country = {}  } = props.location || {};

  return (
    <div className="col-sm-6 col-md-6 country-card">
      <div className="country-card-container border-gray rounded border mx-2 my-3 d-flex flex-row align-items-center p-0 bg-light">

        <div style={{ height: '200px', width: '50%' }} className="position-relative border-gray border-right px-2 bg-white rounded-left col-md-6">
          <Img style={{ width: '100%'}} src={`${SERVE_URL}${id}`} className="d-block h-100" />
        </div>

        <div className="px-3">

          <span className="country-name text-dark d-block font-weight-bold">{ city }</span>

          <span className="country-region text-secondary text-uppercase">{ streetAddress }</span>

          <span className="country-name text-dark d-block font-weight-bold">{ country.countryName }</span>


        </div>

      </div>
    </div>
  )
}

LocationCard.propTypes = {
  location: PropTypes.shape({
    id: PropTypes.string.isRequired,
    streetAddress: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    country: PropTypes.shape({
      countryName: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

export default LocationCard;