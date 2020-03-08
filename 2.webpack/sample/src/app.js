import { sum } from './math';
import nyancat from './nyancat.jpg';
import './style.css';

// console.log(sum(2, 5));

document.addEventListener('DOMContentLoaded', ev => {
  document.body.innerHTML = `<img src="${nyancat}" />`;
});
