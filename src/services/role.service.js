import axios from 'axios';
import authHeader from './auth-header';

const API_ROLE = 'http://localhost:8080/api/role'

class RoleService {

  getRoleList() {
    return axios.get(API_ROLE + '/list', { headers: authHeader() });
  }

}

export default new RoleService();