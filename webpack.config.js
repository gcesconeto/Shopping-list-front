const path = require('path')

module.exports = {
  entry: './src/app.ts',
  output: {
    filename: 'pack.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,  // RegEx to match files
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
};
