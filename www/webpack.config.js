const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const path = require('path');

module.exports = {
  //entry: "./bootstrap.js",
  context: __dirname,
  cache: false,
  entry: {
    wasm: ['./bootstrap.js'],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bootstrap.js",
    //clean: true
  },
  devServer: {
    port: 8080,
    hot: false,
    liveReload: true,
    static: {
      directory: path.join(__dirname, 'dist'),
      //watch: true,
    },
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.rs$/,
        use: [{
          loader: 'wasm-loader'
        }, {
          loader: 'rust-native-wasm-loader',
          options: {
            release: true
          }
        }]
      }
    ]
  },
  // module: {
  //   rules: [
  //     {
  //       test: /.*\.wasm$/,
  //       //type: 'webassembly/sync',
  //       // loader: 'file-loader',
  //       // options: {
  //       //   name: '[name].[ext]'
  //       // }
  //     },
  //   ]
  // },
  plugins: [
    //new CopyWebpackPlugin(['index.html'])
    //new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        { from: "css/**" },
        { from: "js/**" },
        //{ from: "../pkg/**", force: true },
        //{ from: "../pkg/**", to: path.join(__dirname, 'dist'), force: true },
        'style.css',
        'favicon.ico',
        'index.html',
        //{ from: "node_modules/crypto-wasm/**", force: true }
        //{ from: "node_modules/crypto-wasm/**", to: "dist", force: true }
      ],
    }),
    // new HtmlWebpackPlugin({
    //   filename: 'index.html',
    //   inject: true,
    //   template: path.resolve(__dirname, 'index.html'),
    // }),
  ]
  ,
  experiments: {
    asyncWebAssembly: true,
    syncWebAssembly: true
  },
};
