import axios from 'axios';
import authHeader from './auth-header';

const API_TRIP = 'http://localhost:8080/api/trip'

class TripService {

  getTripList() {
    return axios.get(API_TRIP + '/list', { headers: authHeader() });
  }

  createNewTrip(data) {
    return axios.post(API_TRIP, data, { headers: authHeader() });
  }


  updateTrip(data) {
    return axios.put(API_TRIP + '/update', data, { headers: authHeader() });
  }

  getTrip(id) {
    return axios.get(API_TRIP + '/' + id, { headers: authHeader() });
  }

  deleteTrip(id) {
    return axios.delete(API_TRIP + '/delete/' + id, { headers: authHeader() });
  }

  findPageSortingByPriceDescending(currentPage, pageLimit) {
    return axios.get(API_TRIP + '/page/' + currentPage + '/' + pageLimit, { headers: authHeader() });
  }

}

export default new TripService();