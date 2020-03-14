import { sum } from './math';
import nyancat from './nyancat.jpg';
import form from './form';
import './style.css';

let resultEl;
let formEl;

document.addEventListener('DOMContentLoaded', async ev => {
  // document.body.innerHTML = `<img src="${nyancat}" />`;
  formEl = document.createElement('div');
  formEl.innerHTML = form.render();
  document.body.appendChild(formEl);

  // * 다이나믹 임포트 (코드 스플릿팅)
  import(/* webpackChunkName: "result" */ './result').then(async m => {
    const result = m.default;
    resultEl = document.createElement('div');
    resultEl.innerHTML = await result.render();
    document.body.appendChild(resultEl);
  });
});

// ***** webpack-dev-server의 핫모듈 기능
if (module.hot) {
  console.log('핫 모듈 켜짐');

  module.hot.accept('./result', async () => {
    console.log('result 모듈 변경');
    resultEl.innerHTML = await result.render();
  });

  module.hot.accept('./form', () => {
    console.log('form 모듈 변경');
    formEl.innerHTML = form.render();
  });
}

// ****************************************** webpack.DefinePlugin에서 설정한 환경 정보
// console.log(process.env.NODE_ENV);
// console.log(TWO);
// console.log(VERSION); // 'v.1.2.3'
// console.log(PRODUCTION); // true
// console.log(MAX_COUNT); // 999
// console.log(api.domain); // 'http://dev.api.domain.com'
