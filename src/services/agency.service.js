import axios from 'axios';
import authHeader from './auth-header';

const API_AGENCY = 'http://localhost:8080/api/agency'

class AgencyService {

  getAgencyList() {
    return axios.get(API_AGENCY + '/list', { headers: authHeader() });
  }

  createNewAgency(data) {
    return axios.post(API_AGENCY, data, { headers: authHeader() });
  }


  updateAgency(data) {
    return axios.put(API_AGENCY + '/update', data, { headers: authHeader() });
  }

  getAgency(id) {
    return axios.get(API_AGENCY + '/' + id, { headers: authHeader() });
  }

  deleteAgency(id) {
    return axios.delete(API_AGENCY + '/delete/' + id, { headers: authHeader() });
  }

}

export default new AgencyService();