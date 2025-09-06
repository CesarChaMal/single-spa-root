const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Load environment variables from .env file
try {
  require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
} catch (error) {
  console.warn('dotenv not found, using system environment variables only');
}

const webpack = require('webpack');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production' || process.env.SPA_ENV === 'prod';
  const mode = env && env.mode ? env.mode : (process.env.SPA_MODE || 'local');
  const isDevServer = process.argv.includes('webpack-dev-server');
  
  return {
  entry: {
    'root-application': 'root-application-dynamic.js',
  },
  output: {
    publicPath: '/',
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        parser: {
          system: false,
        },
      },
      {
        test: /\.js?$/,
        exclude: [path.resolve(__dirname, 'node_modules')],
        loader: ['babel-loader', 'eslint-loader'],
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.json$/,
        type: 'javascript/auto',
        loader: 'json-loader',
      },
    ],
  },
  node: {
    fs: 'empty',
  },
  resolve: {
    modules: [__dirname, 'node_modules'],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.SPA_MODE': JSON.stringify(process.env.SPA_MODE || 'local'),
      'process.env.SPA_ENV': JSON.stringify(process.env.SPA_ENV || 'dev'),
      AWS_CONFIG: JSON.stringify({
        s3Bucket: process.env.S3_BUCKET,
        region: process.env.AWS_REGION,
        orgName: process.env.ORG_NAME,
      }),
      IMPORTMAP_URL: JSON.stringify(process.env.IMPORTMAP_URL),
      S3_WEBSITE_URL: JSON.stringify(process.env.S3_WEBSITE_URL),
      GITHUB_USERNAME: JSON.stringify(process.env.GITHUB_USERNAME),
    }),
    new CleanWebpackPlugin({
      cleanAfterEveryBuildPatterns: ['dist'],
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, 'public'),
        to: path.resolve(__dirname, 'dist'),
      },
      {
        from: path.resolve(
            __dirname,
            '../single-spa-layout-app/dist/img',
        ),
        to: path.resolve(__dirname, 'dist/img'),
        noErrorOnMissing: true,
      },
    ]),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'index.html'),
      inject: false,
      templateParameters: {
          isLocal: env && env.isLocal === "true",
          mode: mode,
          isProduction: isProduction,
          isDevServer: isDevServer,
          useS3Paths: false, // Regular config never uses S3 paths
          publicPath: '/',
          importmapUrl: process.env.IMPORTMAP_URL || `https://${process.env.S3_BUCKET || 'single-spa-demo-774145483743'}.s3.${process.env.AWS_REGION || 'eu-central-1'}.amazonaws.com/@${process.env.ORG_NAME || 'cesarchamal'}/importmap.json`,
          s3Bucket: process.env.S3_BUCKET || 'single-spa-demo-774145483743',
          awsRegion: process.env.AWS_REGION || 'eu-central-1',
          orgName: process.env.ORG_NAME || 'cesarchamal',
          githubUsername: process.env.GITHUB_USERNAME || 'cesarchamal'
        }
    }),
  ], 
  devtool: isProduction ? false : 'source-map',
  devServer: {
    historyApiFallback: true,
    writeToDisk: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  };
};


/*
{
  from: path.resolve(
      __dirname,
      'node_modules/single-spa-layout-app/dist/img',
  ),
      to: path.resolve(__dirname, 'dist/img'),
    noErrorOnMissing: true,
},
*/
