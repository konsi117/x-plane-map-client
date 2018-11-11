const path = require('path');
const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const config = {
  entry: './src/index.jsx',
  output: {
    filename: './client.js',
    chunkFilename: 'chunk-[name].js',
    path: path.resolve(__dirname, 'build'),
  },
  mode: 'development',
  target: 'web',
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader',
        ],
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'react'],
            plugins: ['transform-object-rest-spread', 'transform-class-properties', 'syntax-dynamic-import'],
          },
        },
      },
      {
        test: /\.svg$/,
        use: {
          loader: 'svg-url-loader',
          options: { noquotes: true },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      leaflet: 'leaflet/dist/leaflet.js',
    },
  },
  plugins: [
    new webpack.DefinePlugin({ PLATFORM: JSON.stringify('web') }),
  ],
  devServer: {
    proxy: {
      '/api': 'http://localhost:9000',
    },
  },
};

if (process.env.ANALYZE_BUNDLE) {
  config.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = config;
