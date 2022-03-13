import axios from 'axios';

export const api = axios.create({
  baseURL: '/api' // axios reaproveita o address do app 
});