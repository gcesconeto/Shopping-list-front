const path = require('path')

module.exports = {
  mode: 'production',
  entry: './src/app.ts',
  output: {
    filename: 'pack.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  devServer: {
    static: {
        directory: path.join(__dirname, '/')
    }
  },
  devtool: false,
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
