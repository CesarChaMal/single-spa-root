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
  const isProduction = argv.mode === 'production' || process.env.NODE_ENV === 'production' || process.env.SPA_ENV === 'prod';
  const mode = env && env.mode ? env.mode : (process.env.SPA_MODE || 'local');

  console.log('🔍 Webpack Debug:');
  console.log('  - argv.mode:', argv.mode);
  console.log('  - NODE_ENV:', process.env.NODE_ENV);
  console.log('  - SPA_ENV:', process.env.SPA_ENV);
  console.log('  - SPA_MODE:', process.env.SPA_MODE);
  console.log('  - isProduction:', isProduction);
  console.log('  - mode:', mode);
  console.log('  - useS3Paths will be:', mode === 'aws' && isProduction);
  console.log('  - publicPath will be:', mode === 'aws' && isProduction ? 'S3 URL' : 'local /');

  // This is for static S3 website builds only
  const useS3Paths = (mode === 'aws' && isProduction);
  let publicPath = '/';

  // ORIGINAL LOGIC (commented out - was causing blank page on S3)
  // if (useS3Paths) {
  //   const s3Bucket = process.env.S3_BUCKET || 'single-spa-demo-774145483743';
  //   const awsRegion = process.env.AWS_REGION || 'eu-central-1';
  //   // Use S3 website URL format, not S3 API format
  //   publicPath = `https://${s3Bucket}.s3-website-${awsRegion}.amazonaws.com/`;
  //   console.log('🔍 S3 Mode Activated:');
  //   console.log('  - useS3Paths:', useS3Paths);
  //   console.log('  - publicPath:', publicPath);
  // } else {
  //   console.log('🔍 Local Mode:');
  //   console.log('  - useS3Paths:', useS3Paths);
  //   console.log('  - publicPath:', publicPath);
  // }

  // FIX: Always use relative paths for S3 static websites
  if (useS3Paths) {
    console.log('🔍 S3 Mode Activated:');
    console.log('  - useS3Paths:', useS3Paths);
    console.log('  - publicPath: / (relative for S3 static website)');
  } else {
    console.log('🔍 Local Mode:');
    console.log('  - useS3Paths:', useS3Paths);
    console.log('  - publicPath:', publicPath);
  }

  const entry = {
    'root-application': 'root-application-dynamic.js',
  };

  const config = {
    mode: isProduction ? 'production' : 'development',
    entry: entry,
    output: {
      publicPath: publicPath,
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist'),
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
        'rxjs': path.resolve(__dirname, 'node_modules/rxjs'),
      },
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
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
        {
          from: path.resolve(__dirname, '../single-spa-angular-app/dist/favicon.ico'),
          to: path.resolve(__dirname, 'dist/favicon.ico'),
          noErrorOnMissing: true,
        },
      ]),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'index.html'),
        inject: false,
        templateParameters: (() => {
          const params = {
            isLocal: env && env.isLocal === "true",
            mode: mode,
            isProduction: isProduction,
            useS3Paths: useS3Paths,
            importmapUrl: process.env.IMPORTMAP_URL || `https://${process.env.S3_BUCKET || 'single-spa-demo-774145483743'}.s3.${process.env.AWS_REGION || 'eu-central-1'}.amazonaws.com/@${process.env.ORG_NAME || 'cesarchamal'}/importmap.json`,
            s3Bucket: process.env.S3_BUCKET || 'single-spa-demo-774145483743',
            awsRegion: process.env.AWS_REGION || 'eu-central-1',
            orgName: process.env.ORG_NAME || 'cesarchamal',
            githubUsername: process.env.GITHUB_USERNAME || 'cesarchamal',
            s3WebsiteUrl: process.env.S3_WEBSITE_URL || `http://${process.env.S3_BUCKET || 'single-spa-demo-774145483743'}.s3-website-${process.env.AWS_REGION || 'eu-central-1'}.amazonaws.com`,
            publicPath: publicPath
          };
          console.log('🔍 Template Parameters:');
          console.log('  - mode:', params.mode);
          console.log('  - isProduction:', params.isProduction);
          console.log('  - useS3Paths:', params.useS3Paths);
          console.log('  - publicPath:', params.publicPath);
          return params;
        })()
      }),
    ],
    devtool: isProduction ? false : 'source-map',
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    },
  };

  // Only add devServer configuration in development
  if (!isProduction) {
    config.devServer = {
      historyApiFallback: true,
      writeToDisk: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      port: 8080,
      host: 'localhost',
    };
  }

  return config;
};