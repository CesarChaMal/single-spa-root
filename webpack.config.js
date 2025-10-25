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
  // Check multiple sources for production mode detection
  const isProduction = argv.mode === 'production'
                      || process.argv.includes('-p')
                      || process.env.SPA_ENV === 'prod';
  const mode = env && env.mode ? env.mode : (process.env.SPA_MODE || 'local');
  const isDevServer = process.argv.includes('webpack-dev-server');

  console.log('🔍 Webpack Debug Info:');
  console.log(`  - argv.mode: ${argv.mode}`);
  console.log(`  - process.argv includes -p: ${process.argv.includes('-p')}`);
  console.log(`  - process.env.SPA_ENV: ${process.env.SPA_ENV}`);
  console.log(`  - Final isProduction: ${isProduction}`);
  console.log(`  - SPA mode: ${mode}`);
  console.log(`  - isDevServer: ${isDevServer}`);

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
          exclude: [/node_modules/],
          loader: ['babel-loader'],
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
      alias: {
        rxjs: path.resolve(__dirname, 'node_modules/rxjs'),
      },
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
        cleanOnceBeforeBuildPatterns: [
          '**/*',
          // Preserve offline dependencies when in offline mode
          ...(process.env.OFFLINE === 'true' ? ['!lib', '!lib/**'] : [])
        ],
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
          mode,
          isProduction,
          isDevServer,
          useS3Paths: false,
          publicPath: '/',
          offline: process.env.OFFLINE === 'true' || false,
          importmapUrl: process.env.IMPORTMAP_URL || `https://${process.env.S3_BUCKET || 'single-spa-demo-774145483743'}.s3.${process.env.AWS_REGION || 'eu-central-1'}.amazonaws.com/@${process.env.ORG_NAME || 'cesarchamal'}/importmap.json`,
          s3Bucket: process.env.S3_BUCKET || 'single-spa-demo-774145483743',
          awsRegion: process.env.AWS_REGION || 'eu-central-1',
          orgName: process.env.ORG_NAME || 'cesarchamal',
          githubUsername: process.env.GITHUB_USERNAME || 'cesarchamal',
          s3WebsiteUrl: process.env.S3_WEBSITE_URL || `http://${process.env.S3_BUCKET || 'single-spa-demo-774145483743'}.s3-website,${process.env.AWS_REGION || 'eu-central-1'}.amazonaws.com`,
        },

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
