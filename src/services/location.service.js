import axios from 'axios';
import authHeader from './auth-header';

const API_LOCATION = 'http://localhost:8080/api/location'

class LocationService {

  getLocationList() {
    return axios.get(API_LOCATION + '/list', { headers: authHeader() });
  }

  createNewLocationAdmin(data) {
    return axios.post(API_LOCATION, data, { headers: authHeader() });
  }

  updateLocationAdmin(data) {
    return axios.put(API_LOCATION + '/update', data, { headers: authHeader() });
  }

  getLocation(id) {
    return axios.get(API_LOCATION + '/' + id, { headers: authHeader() });
  }

  deleteLocation(id) {
    return axios.delete(API_LOCATION + '/delete/' + id, { headers: authHeader() });
  }

  findPage(currentPage) {
    return axios.get(API_LOCATION + '/page/' + currentPage, { headers: authHeader() });
  }



}

export default new LocationService();