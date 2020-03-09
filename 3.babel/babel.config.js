module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          chrome: '79', // 크롬 79까지 지원하는 코드
          ie: '11', // ie 11까지 지원하는 코드
        },

        useBuiltIns: 'usage', // 폴리필 사용 방식 지정

        // core-js promise (IE에서 Promise 사용을 위한 폴리필)
        corejs: {
          // 폴리필 버젼 지정
          version: 2,
        },
      },
    ],
  ],
};
