import axios from 'axios';
import authHeader from './auth-header';

const API_INFO = 'http://localhost:8080/api/info';

class InfoService {
  upload(item) {
    // let formData = new FormData();

    // formData.append("file", item.file);

    return axios.post(API_INFO + '/upload/' + item.id + '/' + item.description, item.imageData, { headers: authHeader()  });
  }


  getImage(id) {
    return axios.get(API_INFO + '/location/getImage/' + id, { headers: authHeader()});
  }

  getInfo(id) {
    return axios.get(API_INFO + '/' + id, { headers: authHeader() });
  }
}

export default new InfoService();