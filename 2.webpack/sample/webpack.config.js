const path = require('path');
const MyWebpackPlugin = require('./my-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    main: './src/app.js',
  },
  output: {
    path: path.resolve('./dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/, // 로더가 처리해야할 파일 확장자
        use: [path.resolve('./my-webpack-loader.js')], // 사용할 로더
      },
      {
        test: /\.css$/,
        // ! use에 적용된 로더는 뒤에서부터 앞으로 적용
        // * css-loader : css를 자바스크립트 코드로 변경
        // * style-loader : 변경된 코드를 동적으로 DOM에 추가
        use: ['style-loader', 'css-loader'], // css-loader부터 적용
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          publicPath: './dist',
          name: '[name].[ext]?[hash]',
          limit: 20000, // 20kb 미만 파일만 data url로 처리. 초과하면 file-loader가 처리
        },
      },
    ],
  },
  plugins: [new MyWebpackPlugin()],
};
