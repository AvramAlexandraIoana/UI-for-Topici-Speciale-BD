import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/test/';
const USER_URL = 'http://localhost:8080/api/user';


class UserService {
  getPublicContent() {
    return axios.get(API_URL + 'all');
  }

  getUserBoard() {
    return axios.get(API_URL + 'user', { headers: authHeader() });
  }

  getModeratorBoard() {
    return axios.get(API_URL + 'mod', { headers: authHeader() });
  }

  getAdminBoard() {
    return axios.get(API_URL + 'admin', { headers: authHeader() });
  }

  getUserList() {
    return axios.get(USER_URL + '/list', { headers: authHeader() });
  }

  deleteUser(id) {
    return axios.delete(USER_URL + '/delete/' + id, { headers: authHeader() });
  }

  getUserById(id) {
    return axios.get(USER_URL + '/' + id, { headers: authHeader() });
  }


  addUserTrip(id, trips) {
    return axios.put(USER_URL + '/' + id, trips, { headers: authHeader() });

  }

  updateRoles(id, roles) {
    return axios.put(USER_URL + '/roles/' + id, roles, { headers: authHeader() });

  }
}

export default new UserService();