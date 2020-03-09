const path = require('path');
// const MyWebpackPlugin = require('./my-webpack-plugin');
const webpack = require('webpack');
const childProcess = require('child_process');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

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
      // {
      //   test: /\.js$/, // 로더가 처리해야할 파일 확장자
      //   use: [path.resolve('./my-webpack-loader.js')], // 사용할 로더
      // },
      {
        test: /\.css$/,
        // ! use에 적용된 로더는 뒤에서부터 앞으로 적용
        // * css-loader : css를 자바스크립트 모듈로 변경
        // * style-loader : 변경된 스타일 코드를 동적으로 DOM에 추가
        use: [
          process.env.NODE_ENV === 'production'
            ? MiniCssExtractPlugin.loader // 프로덕션 환경
            : 'style-loader', // 개발 환경
          'css-loader',
        ], // css-loader부터 적용
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          // publicPath: './dist', // ! HtmlWebpackPlugin 사용 시 주소 변경 필요가 없다.
          name: '[name].[ext]?[hash]',
          limit: 20000, // 20kb 미만 파일만 data url로 처리. 초과하면 file-loader가 처리
        },
      },
    ],
  },
  // * plugin은 번들된 결과물을 처리하는 역할
  plugins: [
    new webpack.BannerPlugin({
      banner: () => `
      빌드 날짜: ${new Date().toLocaleString()}
      커밋 버젼: ${childProcess.execSync('git rev-parse --short HEAD')}
      작성자: ${childProcess.execSync('git config user.name')}
      `,
    }),
    new webpack.DefinePlugin({
      // 웹팩의 개발 환경 정보를 제공
      TWO: '1+1',
      // 문자열로 사용하려면 JSON.stringify()를 사용
      VERSION: JSON.stringify('v.1.2.3'),
      PRODUCTION: JSON.stringify(false),
      MAX_COUNT: JSON.stringify(999),
      'api.domain': JSON.stringify('http://dev.api.domain.com'),
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html', // 템플릿 경로를 지정
      templateParameters: {
        // 템플릿에 주입할 파라미터 변수 지정
        env: process.env.NODE_ENV === 'development' ? '(개발용)' : '(프로덕션)',
      },
      minify:
        process.env.NODE_ENV === 'production'
          ? {
              collapseWhitespace: true, // 공백 제거
              removeComments: true, // 주석 제거
            }
          : false,
      hash: true, // 정적 파일을 불러올때 쿼리문자열에 웹팩 해쉬값을 추가한다
    }),
    new CleanWebpackPlugin(), // 이전 빌드 결과물을 삭제하고 빌드
    // css를 별도로 분리하는 플러그인 (속도 향상을 위해)
    ...(process.env.NODE_ENV === 'production'
      ? [new MiniCssExtractPlugin({ filename: `[name].css` })]
      : []),
  ],
};
