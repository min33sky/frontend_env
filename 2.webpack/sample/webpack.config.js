const path = require('path');
// const MyWebpackPlugin = require('./my-webpack-plugin');
const webpack = require('webpack');
const childProcess = require('child_process');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 빌드 시 css 분리
const apiMocker = require('connect-api-mocker');
// * 최적화 관련 모듈들
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin'); // css 압축
const TerserPlugin = require('terser-webpack-plugin'); // JS 코드 난독화, debugger 구문 제거
const CopyPlugin = require('copy-webpack-plugin'); // 파일 복사 플러그인

const mode = process.env.NODE_ENV || 'development';

module.exports = {
  mode,

  entry: {
    main: './src/app.js',
    // result: './src/result.js', // ! 다이나믹 임포트를 사용하면 엔트리 포인트에 등록 안해도 된다.
  },

  output: {
    path: path.resolve('./dist'),
    filename: '[name].js', // entry의 프로퍼티값이 name에 들어감
  },

  // * 로더들을 등록하는 곳
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
        ], // css-loader부터 역으로 적용
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

  // * 빌드 과정 최적화
  optimization: {
    // ! 코드 스플릿할 때 중복을 제거하는 설정 (다이나믹 임포트를 쓰면 안써도 된다.)
    // splitChunks: {
    //   chunks: 'all',
    // },
    // optimization.minimizer는 웹팩이 결과물을 압축할 때 사용하는 플러그인을 넣는 배열
    minimizer:
      mode === 'production'
        ? [
            new OptimizeCSSAssetsPlugin(),
            new TerserPlugin({
              terserOptions: {
                compress: {
                  drop_console: true, // 콘솔 로그 제거
                },
              },
            }),
          ]
        : [],
  },

  // * 빌드 과정에서 제외 (써드 파티 모듈은 이미 빌드를 거쳤기 때문에)
  externals: {
    axios: 'axios', // node_modules에서 웹팩 output 폴더에 옮기고 index.html에서 로딩한다.
  },

  // * Webpack-dev-server 설정
  devServer: {
    overlay: true, // 빌드 시 에러나 경고를 브라우져 화면에 표시
    stats: 'errors-only',
    // before: (app, server, compiler) => {
    //   app.get('/api/users', (req, res) => {
    //     res.json([
    //       {
    //         id: 1,
    //         name: 'Alice',
    //       },
    //       {
    //         id: 2,
    //         name: 'Bek',
    //       },
    //       {
    //         id: 3,
    //         name: 'Chris',
    //       },
    //     ]);
    //   });
    // },
    // * 목업 API 갯수가 많다면 파일로 관리하는 것이 편리
    before: (app, server, compiler) => {
      app.use(apiMocker('/api', './mocks/api'));
    },
    // * 프론트에서 CORS 문제 해결
    // proxy: {
    //   '/api': 'http://localhost:API제공서버포트',
    // },
    // * 핫 모듈 (전체화면 갱신이 아닌 바뀐 부분만 갱신하는 기능)
    hot: true,
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

    // * 웹팩의 개발 환경 정보를 제공
    new webpack.DefinePlugin({
      TWO: '1+1',
      // 문자열로 사용하려면 JSON.stringify()를 사용
      VERSION: JSON.stringify('v.1.2.3'),
      PRODUCTION: JSON.stringify(false),
      MAX_COUNT: JSON.stringify(999),
      'api.domain': JSON.stringify('http://dev.api.domain.com'),
    }),

    // * HTML 파일 압축
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

    // * 이전 빌드를 지우고 새로 빌드
    new CleanWebpackPlugin(),

    // * 파일 복사 플러그인 (써드 파티 모듈을 옮길 때 사용)
    new CopyPlugin([
      {
        from: './node_modules/axios/dist/axios.min.js',
        to: './axios.min.js', // dist폴더로 옮겨진 파일
      },
    ]),

    // css를 별도로 분리하는 플러그인 (속도 향상을 위해)
    ...(process.env.NODE_ENV === 'production'
      ? [new MiniCssExtractPlugin({ filename: `[name].css` })]
      : []),
  ],
};
