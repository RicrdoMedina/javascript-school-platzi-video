const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
require('dotenv').config();
const ManifestPlugin = require('webpack-manifest-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const isDev = process.env.ENV === 'development';

const entry = ['./src/frontend/index.js'];

if (isDev) {
  entry.push(
    'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=2000&reload=true'
  );
}

module.exports = {
  entry,
  mode: process.env.ENV,
  output: {
    path: path.resolve(__dirname, 'src/server/public'),
    filename: isDev ? 'assets/app.js' : 'assets/app-[hash].js',
    publicPath: '/',
  },
  devServer: {
    port: 9000,
    hot: true,
    open: true,
    historyApiFallback: true,
  },
  devtool: 'eval-source-map',
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
    splitChunks: {
      chunks: 'async', // los chunk son asincronos
      name: true, // Le indicaremos un nombre
      cacheGroups: {
        //Inicamos el grupo de cache para que cree el vendorFile
        vendors: {
          name: 'vendors', //Nombre
          chunks: 'all', //Que tipo de chunk todos los posibles
          reuseExistingChunk: true, // Reusar chunk existentes
          priority: 1, // Prioridad va del 1 al 10, le indicamos que tome la maxima prioridad posible a los chuck que este creando
          filename: isDev ? 'assets/vendor.js' : 'assets/vendor-[hash].js', // Segun el entorno va a tomar un vendor.js o vendor-hash.js
          enforce: true, // Si encuentra un error durante el proceso falla
          test(module, chunks) {
            // Funcion que devuelve los chunks que necesitamos
            const name = module.nameForCondition && module.nameForCondition(); //validamos que podamos obtener el nameForCondition de nuestro chunk y que se pueda validar en una condicion, es decir que exista
            return chunks.some(
              // validamos que sea diferente de vendors y que este dentro de node_modules
              (chunk) =>
                chunk.name !== 'vendors' && /[\\/]node_modules[\\/]/.test(name)
            );
          },
        },
      },
    },
  },
  module: {
    rules: [
      // {
      //   enforce: 'pre',
      //   test: /\.(js|jsx)$/,
      //   exclude: /node_modules/,
      //   loader: 'eslint-loader',
      // },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(s*)css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(jpg|png|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/[hash].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    isDev ? new webpack.HotModuleReplacementPlugin() : () => {},
    isDev
      ? () => {}
      : new CleanWebpackPlugin({
          cleanOnceBeforeBuildPatterns: path.resolve(
            __dirname,
            'src/server/public'
          ),
        }),
    isDev
      ? () => {}
      : new CompressionWebpackPlugin({
          test: /\.js$|\.css$/,
          filename: '[path].gz',
        }),
    isDev ? () => {} : new ManifestPlugin(),
    new MiniCssExtractPlugin({
      filename: isDev ? 'assets/app.css' : 'assets/app-[hash].css',
    }),
  ],
};
