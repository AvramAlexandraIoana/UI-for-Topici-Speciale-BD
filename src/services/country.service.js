import axios from 'axios';
import authHeader from './auth-header';

const API_COUNTRY = 'http://localhost:8080/api/country'

class CountryService {

  getCountryList() {
    return axios.get(API_COUNTRY + '/list', { headers: authHeader() });
  }

  createNewCountryAdmin(data) {
    return axios.post(API_COUNTRY, data, { headers: authHeader() });
  }

  getCountryAdmin(id) {
    return axios.get(API_COUNTRY + '/' + id, { headers: authHeader() });
  }

  updateCountryAdmin(data) {
    return axios.put(API_COUNTRY + '/update', data, { headers: authHeader() });
  }

  deleteCountry(id) {
    return axios.delete(API_COUNTRY + '/delete/' + id, { headers: authHeader() });
  }
}

export default new CountryService();