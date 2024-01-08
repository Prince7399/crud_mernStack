import axios from 'axios';

export const axiosInstance = async (method, endpoint, params) => {
    if (method === 'get') {
        return axios?.[method](`http://localhost:5001/${endpoint}`).then((res) => {
            return res;
        }).catch((err) => console.log(err))
    } else if (method === 'post' || method === 'put' || method == 'delete') {
        if (params) {
            return axios?.[method](`http://localhost:5001/${endpoint}`, params).then((res) => {
                return res;
            }).catch((err) => console.log(err))
        } else {
            return axios?.[method](`http://localhost:5001/${endpoint}`).then((res) => {
                return res;
            }).catch((err) => console.log(err))
        }
    }
}