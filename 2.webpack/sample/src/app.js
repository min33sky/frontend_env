import { sum } from './math';
import nyancat from './nyancat.jpg';
import axios from 'axios';
import './style.css';

// console.log(sum(2, 5));

document.addEventListener('DOMContentLoaded', async ev => {
  // document.body.innerHTML = `<img src="${nyancat}" />`;

  const res = await axios.get('/api/users');

  console.log(res.data);

  document.body.innerHTML = (res.data || [])
    .map(user => {
      console.log(user);
      return `<div>${user.id}: ${user.name}</div>`;
    })
    .join('');
});

// * webpack.DefinePlugin에서 설정한 환경 정보
// console.log(process.env.NODE_ENV);
// console.log(TWO);
// console.log(VERSION); // 'v.1.2.3'
// console.log(PRODUCTION); // true
// console.log(MAX_COUNT); // 999
// console.log(api.domain); // 'http://dev.api.domain.com'
