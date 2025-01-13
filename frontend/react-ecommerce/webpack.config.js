const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { DefinePlugin } = require('webpack');
const Dotenv = require('dotenv-webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  mode: isProduction ? 'production' : 'development',
  
  // Entry point of the application
  entry: './src/main.tsx',
  
  // Output configuration
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: isProduction 
      ? 'static/js/[name].[contenthash:8].js' 
      : 'static/js/bundle.js',
    chunkFilename: isProduction 
      ? 'static/js/[name].[contenthash:8].chunk.js' 
      : 'static/js/[name].chunk.js',
    publicPath: '/',
    clean: true  // Clean the output directory before emit
  },
  
  // Resolve configuration
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@stores': path.resolve(__dirname, 'src/stores')
    }
  },
  
  // Module rules
  module: {
    rules: [
      // TypeScript and React
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env', 
              '@babel/preset-react', 
              '@babel/preset-typescript'
            ],
            plugins: [
              '@babel/plugin-transform-runtime',
              isProduction && 'babel-plugin-transform-react-remove-prop-types'
            ].filter(Boolean)
          }
        }
      },
      
      // CSS and SCSS
      {
        test: /\.(css|scss)$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  'autoprefixer',
                  isProduction && 'cssnano'
                ].filter(Boolean)
              }
            }
          },
          'sass-loader'
        ]
      },
      
      // Images
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'static/media/[name].[hash:8][ext]'
        }
      },
      
      // Fonts
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'static/fonts/[name].[hash:8][ext]'
        }
      }
    ]
  },
  
  // Plugins
  plugins: [
    // HTML template
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      minify: isProduction ? {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      } : false
    }),
    
    // Extract CSS
    isProduction && new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css',
      chunkFilename: 'static/css/[name].[contenthash:8].chunk.css'
    }),
    
    // Environment variables
    new Dotenv({
      path: isProduction ? '.env.production' : '.env.development'
    }),
    
    // Define environment variables
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.PUBLIC_URL': JSON.stringify(process.env.PUBLIC_URL || '')
    }),
    
    // Bundle analyzer (optional)
    isProduction && new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: 'bundle-report.html'
    })
  ].filter(Boolean),
  
  // Optimization
  optimization: {
    minimize: isProduction,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true
          },
          output: {
            comments: false
          }
        },
        extractComments: false
      }),
      new CssMinimizerPlugin()
    ],
    
    // Code splitting
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        },
        styles: {
          test: /\.css$/,
          name: 'styles',
          chunks: 'all',
          enforce: true
        }
      }
    },
    
    // Runtime chunk
    runtimeChunk: 'single'
  },
  
  // Development server
  devServer: {
    static: path.join(__dirname, 'dist'),
    compress: true,
    port: 3000,
    open: true,
    hot: true,
    historyApiFallback: true
  },
  
  // Source maps
  devtool: isProduction ? 'source-map' : 'cheap-module-source-map',
  
  // Performance hints
  performance: {
    hints: isProduction ? 'warning' : false,
    maxEntrypointSize: 250000,
    maxAssetSize: 250000
  }
};
