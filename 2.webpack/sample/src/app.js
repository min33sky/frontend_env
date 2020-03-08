import { sum } from './math';
import nyancat from './nyancat.jpg';
import './style.css';

// console.log(sum(2, 5));

document.addEventListener('DOMContentLoaded', ev => {
  document.body.innerHTML = `<img src="${nyancat}" />`;
});

// * webpack.DefinePlugin에서 설정한 환경 정보
console.log(process.env.NODE_ENV);
console.log(TWO);
console.log(VERSION); // 'v.1.2.3'
console.log(PRODUCTION); // true
console.log(MAX_COUNT); // 999
console.log(api.domain); // 'http://dev.api.domain.com'
