const { merge } = require("webpack-merge");
const common = require("./webpack.common");

/** @type {import('webpack').Configuration} */
module.exports = merge(common, {
  mode: "development",
  devtool: "eval-source-map",
  optimization: {
    minimize: false,
  },
  devServer: {
    port: 3000,
    historyApiFallback: true,
    hot: true,
    open: false,
    proxy: [
      {
        context: ["/itunes-proxy"],
        target: "https://itunes.apple.com",
        changeOrigin: true,
        pathRewrite: { "^/itunes-proxy": "" },
        secure: true,
      },
    ],
  },
});
